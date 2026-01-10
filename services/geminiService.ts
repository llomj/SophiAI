import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { Persona, Message, Conversation, Concept, CustomPersona, Fallacy } from "../types";
import { PERSONA_CONFIGS } from "../constants";
import { MATRIX_DNA } from "../persona_forge/matrix_dna";
import { TJUMP_DATA } from "../persona_forge/tjump";
import { TJUMP_MIND_DATA } from "../persona_forge/TJump_mind";
import { loadApiKey } from "../utils/storage";

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
export const getPersonaDNA = (persona: string): string => {
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
  // Check for user-provided API key first, then fallback to environment variable (dev only)
  const userApiKey = loadApiKey();
  const envApiKey = (process.env.API_KEY && process.env.API_KEY !== 'null' && process.env.API_KEY !== 'undefined' ? String(process.env.API_KEY).trim() : null) || 
                    (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'null' && process.env.GEMINI_API_KEY !== 'undefined' ? String(process.env.GEMINI_API_KEY).trim() : null);
  const apiKey = userApiKey || envApiKey;
  
  if (!apiKey || apiKey === 'null' || apiKey === 'undefined' || !apiKey.trim()) {
    console.error("❌ API Key is missing!");
    console.error("Please set your API key using the 🔑 key icon in the sidebar.");
    console.error("Get your API key from: https://aistudio.google.com/app/apikey");
    
    return { 
      text: "🔑 **API Key Required**\n\nTo use SophiAI, you need to set your own Google Gemini API key.\n\n**Steps:**\n1. Click the 🔑 key icon in the sidebar\n2. Get your API key from: https://aistudio.google.com/app/apikey\n3. Enter your API key in the configuration modal\n4. Click 'Save & Reload'\n\n**Why?**\n- Your API key is stored securely in your browser only\n- Each user needs their own key for privacy and cost control\n- Your conversations remain completely private\n\n**Get Started:** Click the 🔑 icon in the sidebar →", 
      contradictionDetected: false, 
      fallacies: [] 
    };
  }
  
  console.log("✅ API Key loaded, length:", apiKey.length);
  console.log("✅ API Key starts with:", apiKey.substring(0, 4));
  
  const ai = new GoogleGenAI({ apiKey });
  
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
    console.log("Calling Gemini API with model: gemini-3-flash-preview");
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
    if (!rawText || rawText === "Neural connection timeout.") {
      console.warn("API response had no text content:", response);
    }
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
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    const errorMessage = error?.message || error?.toString() || "Unknown error";
    const isApiKeyError = errorMessage.includes("API key") || errorMessage.includes("401") || errorMessage.includes("403");
    const errorText = isApiKeyError
      ? "🔑 **API Key Error**\n\nYour API key appears to be invalid or expired. Please:\n\n1. Click the 🔑 key icon in the sidebar\n2. Check your API key at: https://aistudio.google.com/app/apikey\n3. Make sure you copied the entire key correctly\n4. Try saving it again\n\nError: " + errorMessage
      : `API Error: ${errorMessage}`;
    return { text: errorText, contradictionDetected: false, fallacies: [] };
  }
};

export const extractConceptsFromText = async (conversationText: string, existingConceptLabels: string[], conversationId?: string): Promise<Partial<Concept>[]> => {
  // Check for user-provided API key first, then fallback to environment variable (dev only)
  const userApiKey = loadApiKey();
  const envApiKey = (process.env.API_KEY && process.env.API_KEY !== 'null' && process.env.API_KEY !== 'undefined' ? String(process.env.API_KEY).trim() : null) || 
                    (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'null' && process.env.GEMINI_API_KEY !== 'undefined' ? String(process.env.GEMINI_API_KEY).trim() : null);
  const apiKey = userApiKey || envApiKey;
  
  if (!apiKey || !apiKey.trim()) {
    console.error("API Key is missing for concept extraction!");
    return [];
  }
  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash-latest',
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
    const extracted = JSON.parse(response.text?.trim() || "[]");
    // Add conversation ID to each concept's connections
    if (conversationId) {
      return extracted.map((c: Partial<Concept>) => ({
        ...c,
        connections: [conversationId]
      }));
    }
    return extracted;
  } catch (error) { 
    console.error("Extraction error:", error);
    return []; 
  }
};
