import { GoogleGenAI, Chat } from "@google/genai";
import { PORTFOLIO_CONTEXT } from "../constants";

// Initialize the client
// API_KEY is guaranteed to be in process.env.API_KEY per instructions
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are a helpful, professional, and friendly AI assistant for ${PORTFOLIO_CONTEXT.owner}'s personal portfolio website.
Your goal is to help visitors learn more about Alex, his projects, and his thoughts on technology.

Here is the data you have access to:
${JSON.stringify(PORTFOLIO_CONTEXT, null, 2)}

Guidelines:
1. Keep answers concise and engaging.
2. If asked about specific projects, use the details provided in the context.
3. If asked about technical skills, reference the skills list and how they are used in the projects.
4. If a user asks something outside the scope of a professional portfolio (e.g., "How do I bake a cake?"), politely steer the conversation back to Alex's work or technology, or provide a brief answer but link it back to creativity if possible.
5. Format your responses using Markdown (e.g., bold for emphasis, lists for readability).
`;

let chatSession: Chat | null = null;

export const getChatSession = (): Chat => {
  if (!chatSession) {
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });
  }
  return chatSession;
};

export const sendMessageToGemini = async (message: string) => {
  const chat = getChatSession();
  // Using stream for better UX
  return chat.sendMessageStream({ message });
};