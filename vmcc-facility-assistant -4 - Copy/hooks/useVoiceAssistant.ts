import { useState, useRef, useCallback, useEffect } from 'react';

// Web Speech API is not standard, so we check for vendor prefixes and handle it gracefully.
const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

/**
 * A hook to handle voice input using the browser's Web Speech API.
 * @param handleSendMessage - Callback function to send the transcribed text to the chat.
 * @param isSending - Boolean to prevent starting recognition while the bot is replying.
 * @returns { isListening, toggleListening }
 */
export const useSpeechRecognition = (
    handleSendMessage: (text: string) => void,
    isSending: boolean
) => {
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any | null>(null); // Use `any` for broader compatibility with SpeechRecognition types

    // This effect initializes the recognition engine once and sets up its event listeners.
    useEffect(() => {
        if (!SpeechRecognitionAPI) {
            console.warn("Speech Recognition API is not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognitionAPI();
        recognition.continuous = false; // Stop after the user finishes talking.
        recognition.interimResults = false; // We only need the final, most accurate transcript.
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
        };

        // This is fired when the speech recognition service returns a result.
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            if (transcript) {
                // Use the main app's send message function to process the transcribed text.
                handleSendMessage(transcript);
            }
        };

        recognitionRef.current = recognition;

    }, [handleSendMessage]);

    const toggleListening = useCallback(() => {
        if (!recognitionRef.current) return;
        
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            // Do not start listening if a message is already being sent/processed.
            if (!isSending) {
                try {
                    recognitionRef.current.start();
                } catch (error) {
                    console.error("Could not start speech recognition:", error);
                }
            }
        }
    }, [isListening, isSending]);

    return { isListening, toggleListening };
};
