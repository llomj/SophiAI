import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { Persona, Message, Conversation, Concept, CustomPersona, Fallacy } from "../types";
import { PERSONA_CONFIGS } from "../constants";
import { MATRIX_DNA } from "../persona_forge/matrix_dna";
import { TJUMP_DATA } from "../persona_forge/tjump";
import { TJUMP_MIND_DATA } from "../persona_forge/TJump_mind";

const UNIVERSAL_DEBATE_PROTOCOL = `
[DEBATE_PROTOCOL_ACTIVE]
- DIALECTICAL CHALLENGE: Do not just agree. Search for logical fallacies.
- CONTRADICTION DETECTION: Flag inconsistencies with [LOGICAL_INCONSISTENCY].
- FALLACY DETECTION: Identify specific logical fallacies in the user's reasoning or your own.
  FORMAT: You MUST tag detected fallacies using the exact syntax: [FALLACY: Name | Definition | Example]
- EPISTEMIC RIGOR: Force justifications and Novel Testable Predictions.
- INTERACTIVE QUESTIONING: End turns with probing questions.
- NO MONOLOGUES: Keep it punchy.
`;

const EMOJI_DIRECTIVE = `
[VISUAL_ENRICHMENT_ACTIVE]
- Integrate relevant emojis throughout your response to make the dialogue more engaging, visual, and expressive. Use them for emphasis and tone. ✨🧠🔥
`;

// Helper to get static DNA without burdening the React state
const getPersonaDNA = (persona: string): string => {
  if (persona === Persona.TJUMP) {
    return `${TJUMP_DATA}\n\n[NEURAL_MIND_EXTENSION]:\n${TJUMP_MIND_DATA}`;
  }
  return MATRIX_DNA[persona] || "";
};

export const getPhilosophicalResponse = async (
  persona: string,
  history: Message[],
  userInput: string,
  contextNote?: string,
  userModifiedAugmentation?: string, // Only what the user typed in the Forge
  userPrompt?: string,
  allConversations: Conversation[] = [],
  customPersonas: CustomPersona[] = [],
  emojiMode: boolean = false
): Promise<{ text: string; contradictionDetected: boolean; fallacies: Fallacy[] }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Resolve Persona Config
  let personaConfig = PERSONA_CONFIGS[persona];
  if (!personaConfig) {
    const custom = customPersonas.find(p => p.name === persona);
    if (custom) {
      personaConfig = {
        instruction: custom.instruction,
        description: custom.description,
        color: custom.color || "bg-slate-500/10 text-slate-400 border-slate-500/30",
        glow: "shadow-[0_0_15px_rgba(148,163,184,0.3)]",
        focus: [],
        category: 'Modern'
      };
    }
  }

  if (!personaConfig) personaConfig = PERSONA_CONFIGS[Persona.TJUMP];
  
  let systemInstruction = personaConfig.instruction + "\n" + UNIVERSAL_DEBATE_PROTOCOL;

  if (emojiMode) systemInstruction += "\n" + EMOJI_DIRECTIVE;
  
  if (userPrompt) {
    systemInstruction += `\n\n[GLOBAL_USER_PROFILE_DIRECTIVE]:\n"${userPrompt}"`;
  }

  const otherConversations = allConversations
    .filter(c => c.persona !== persona && c.messages.length > 0)
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 3);

  if (otherConversations.length > 0) {
    systemInstruction += `\n\n[CROSS_MATRIX_NEURAL_RECALL]:\n${otherConversations.map(c => `- MATRIX: ${c.persona} | TOPIC: ${c.title} | KEY_EXCHANGE: ${c.messages.slice(-2).map(m => m.content).join(" | ")}`).join("\n")}`;
  }

  // Combine static DNA with user-modified logic from the Forge
  const baseDNA = getPersonaDNA(persona);
  const combinedDNA = userModifiedAugmentation ? `${baseDNA}\n\n[USER_OVERRIDE_LOGIC]:\n${userModifiedAugmentation}` : baseDNA;

  if (combinedDNA) {
    systemInstruction += `\n\n[AUGMENTED_PERSONA_DNA]:\n"${combinedDNA}"`;
  }

  if (contextNote) {
    systemInstruction += `\n\n[SESSION_CONTEXT_INGESTION]:\n"${contextNote}"`;
  }

  const contents = history.map(msg => ({
    role: msg.role === 'user' ? 'user' as const : 'model' as const,
    parts: [{ text: msg.content }]
  }));

  contents.push({ role: 'user', parts: [{ text: userInput }] });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
        topP: 0.9,
      }
    });

    let rawText = response.text || "Neural connection timeout.";
    const contradictionDetected = rawText.includes("[LOGICAL_INCONSISTENCY]");
    
    const fallacyRegex = /\[FALLACY:\s*([^|\]]+)\s*\|\s*([^|\]]+)\s*\|\s*([^\]]+)\]/g;
    const fallacies: Fallacy[] = [];
    let match;
    
    while ((match = fallacyRegex.exec(rawText)) !== null) {
      fallacies.push({
        name: match[1].trim(),
        definition: match[2].trim(),
        example: match[3].trim()
      });
    }

    const cleanedText = rawText.replace(fallacyRegex, "").trim();
    return { text: cleanedText, contradictionDetected, fallacies };
  } catch (error) {
    console.error("Gemini Error:", error);
    return { text: "API Error: Communication with the reasoning matrix failed.", contradictionDetected: false, fallacies: [] };
  }
};

export const extractConceptsFromText = async (conversationText: string, existingConceptLabels: string[]): Promise<Partial<Concept>[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze the following philosophical dialogue and extract exactly 3 key concepts. 
      Format as JSON. 
      Assign a category like 'ETHICS', 'METAPHYSICS', 'LOGIC', 'POLITICAL', or 'EXISTENTIAL'.
      Rate importance from 1-5.
      
      Dialogue:
      ${conversationText}
      
      Existing concepts in the system to avoid duplicates if possible: ${existingConceptLabels.join(", ")}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              label: { type: Type.STRING },
              description: { type: Type.STRING },
              category: { type: Type.STRING },
              importance: { type: Type.NUMBER }
            },
            required: ["label", "description", "category", "importance"]
          }
        }
      }
    });
    return JSON.parse(response.text?.trim() || "[]");
  } catch (error) { 
    console.error("Extraction error:", error);
    return []; 
  }
};
