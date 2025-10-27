import { GoogleGenAI } from "@google/genai";

type ServerChatMessage = {
    sender: 'user' | 'bot';
    text: string;
};

const SYSTEM_INSTRUCTION = "You are a friendly and helpful AI assistant for the VMCC campus facility services. Provide concise and accurate information about campus facilities, maintenance requests, and general campus questions. If a user reports a problem, acknowledge the report, summarize the location and description, and inform them that an admin has been notified and a ticket will be created shortly. Do not invent a ticket ID.";

// This function will be deployed as a serverless endpoint.
// It uses the standard Web Request and Response APIs.
export async function POST(request: Request) {
    try {
        const { prompt, history } = await request.json();

        if (!process.env.API_KEY) {
            return new Response(JSON.stringify({ error: 'API key is not configured.' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const model = 'gemini-2.5-flash';

        const chat = ai.chats.create({
            model: model,
            config: { systemInstruction: SYSTEM_INSTRUCTION },
            history: (history as ServerChatMessage[]).map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            })),
        });

        const result = await chat.sendMessage({ message: prompt });
        
        return new Response(JSON.stringify({ text: result.text }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error("Error in Gemini API proxy:", error);
        return new Response(JSON.stringify({ error: 'Failed to get response from AI.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}