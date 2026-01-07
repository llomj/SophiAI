
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { Persona, Message, Conversation } from "../types";
import { PERSONA_CONFIGS } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const UNIVERSAL_DEBATE_PROTOCOL = `
[DEBATE_PROTOCOL_ACTIVE]
- DIALECTICAL CHALLENGE: Do not just agree. Search for logical fallacies.
- CONTRADICTION DETECTION: Flag inconsistencies with [LOGICAL_INCONSISTENCY].
- EPISTEMIC RIGOR: Force justifications and Novel Testable Predictions.
- INTERACTIVE QUESTIONING: End turns with probing questions.
- NO MONOLOGUES: Keep it punchy.
`;

export const getPhilosophicalResponse = async (
  persona: Persona,
  history: Message[],
  userInput: string,
  contextNote?: string,
  personaAugmentation?: string,
  userPrompt?: string,
  allConversations: Conversation[] = []
): Promise<{ text: string; contradictionDetected: boolean }> => {
  const personaConfig = PERSONA_CONFIGS[persona];
  
  let systemInstruction = personaConfig.instruction + "\n" + UNIVERSAL_DEBATE_PROTOCOL;
  
  // 1. STATIC USER PROMPT (Identity Directive)
  if (userPrompt) {
    systemInstruction += `\n\n[GLOBAL_USER_PROFILE_DIRECTIVE]:
"${userPrompt}"
(Always apply these behavioral rules to your output style.)`;
  }

  // 2. CROSS-MATRIX NEURAL RECALL (Historical Memory)
  const otherConversations = allConversations
    .filter(c => c.persona !== persona && c.messages.length > 0)
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 3); // Get 3 most recent sessions from other personas

  if (otherConversations.length > 0) {
    systemInstruction += `\n\n[CROSS_MATRIX_NEURAL_RECALL]:
The user has previously engaged in other philosophical matrices. Use this context to avoid repetition and provide a cohesive experience:
${otherConversations.map(c => `- MATRIX: ${c.persona} | TOPIC: ${c.title} | KEY_EXCHANGE: ${c.messages.slice(-2).map(m => m.content).join(" | ")}`).join("\n")}
`;
  }

  // 3. PERSONA FORGE DATA
  if (personaAugmentation) {
    systemInstruction += `\n\n[AUGMENTED_PERSONA_DNA]:
"${personaAugmentation}"`;
  }

  // 4. ACTIVE CONTEXT
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

export const extractConcepts = async (conversationText: string): Promise<{ label: string, description: string }[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Extract up to 5 key philosophical concepts from this dialogue. JSON format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              label: { type: Type.STRING },
              description: { type: Type.STRING }
            },
            required: ["label", "description"]
          }
        }
      }
    });
    return JSON.parse(response.text?.trim() || "[]");
  } catch (error) { return []; }
};

export const generateThoughtExperiment = async (history: Message[]): Promise<string> => {
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
