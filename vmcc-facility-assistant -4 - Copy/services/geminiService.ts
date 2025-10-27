import { ChatMessage } from "../types";

/**
 * Sends a prompt and chat history to the backend proxy for a response from the Gemini API.
 * @param prompt - The user's latest message.
 * @param history - The entire chat history.
 * @returns The text response from the AI.
 */
export const generateTextResponse = async (
    prompt: string, 
    history: ChatMessage[]
): Promise<string> => {
    try {
        const response = await fetch('/api/gemini', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                prompt, 
                // The proxy only needs the sender and text for context.
                // Exclude the initial bot message for a cleaner history.
                history: history.slice(1).map(({ sender, text }) => ({ sender, text })),
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `API error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.text;
    } catch (error) {
        console.error("Proxy API error:", error);
        throw new Error("Failed to generate response from AI.");
    }
};
