
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { Persona, Message, Conversation, Concept, CustomPersona } from "../types";
import { PERSONA_CONFIGS } from "../constants";

const UNIVERSAL_DEBATE_PROTOCOL = `
[DEBATE_PROTOCOL_ACTIVE]
- DIALECTICAL CHALLENGE: Do not just agree. Search for logical fallacies.
- CONTRADICTION DETECTION: Flag inconsistencies with [LOGICAL_INCONSISTENCY].
- EPISTEMIC RIGOR: Force justifications and Novel Testable Predictions.
- INTERACTIVE QUESTIONING: End turns with probing questions.
- NO MONOLOGUES: Keep it punchy.
`;

export const getPhilosophicalResponse = async (
  persona: string,
  history: Message[],
  userInput: string,
  contextNote?: string,
  personaAugmentation?: string,
  userPrompt?: string,
  allConversations: Conversation[] = [],
  customPersonas: CustomPersona[] = []
): Promise<{ text: string; contradictionDetected: boolean }> => {
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
        category: 'Modern' // Fallback
      };
    }
  }

  // Fallback if still not found
  if (!personaConfig) {
    personaConfig = PERSONA_CONFIGS[Persona.STOIC];
  }
  
  let systemInstruction = personaConfig.instruction + "\n" + UNIVERSAL_DEBATE_PROTOCOL;
  
  if (userPrompt) {
    systemInstruction += `\n\n[GLOBAL_USER_PROFILE_DIRECTIVE]:
"${userPrompt}"
(Always apply these behavioral rules to your output style.)`;
  }

  const otherConversations = allConversations
    .filter(c => c.persona !== persona && c.messages.length > 0)
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 3);

  if (otherConversations.length > 0) {
    systemInstruction += `\n\n[CROSS_MATRIX_NEURAL_RECALL]:
The user has previously engaged in other philosophical matrices. Use this context to avoid repetition and provide a cohesive experience:
${otherConversations.map(c => `- MATRIX: ${c.persona} | TOPIC: ${c.title} | KEY_EXCHANGE: ${c.messages.slice(-2).map(m => m.content).join(" | ")}`).join("\n")}
`;
  }

  if (personaAugmentation) {
    systemInstruction += `\n\n[AUGMENTED_PERSONA_DNA]:
"${personaAugmentation}"`;
  }

  if (contextNote) {
    systemInstruction += `\n\n[SESSION_CONTEXT_INGESTION]:
"${contextNote}"`;
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

    const text = response.text || "Neural connection timeout.";
    const contradictionDetected = text.includes("[LOGICAL_INCONSISTENCY]");

    return { text, contradictionDetected };
  } catch (error) {
    console.error("Gemini Error:", error);
    return { text: "API Error: Communication with the reasoning matrix failed.", contradictionDetected: false };
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

export const generateThoughtExperiment = async (history: Message[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const context = history.map(m => m.content).join("\n").slice(-2000);
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a mini thought experiment based on this context:\n\n${context}`,
      config: { systemInstruction: "You are a creative philosopher." }
    });
    return response.text || "Contemplation failed.";
  } catch (error) { return "Contemplation failed."; }
};
