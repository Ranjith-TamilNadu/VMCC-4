import React, { useState, useRef, KeyboardEvent } from 'react';
import SendIcon from './icons/SendIcon';
import MicButton from './MicButton';

interface InputAreaProps {
    onSendMessage: (message: string) => void;
    isSending: boolean;
    isListening: boolean;
    toggleListening: () => void;
}

const InputArea: React.FC<InputAreaProps> = ({
    onSendMessage,
    isSending,
    isListening,
    toggleListening
}) => {
    const [text, setText] = useState('');
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const handleSend = () => {
        if (text.trim() && !isSending) {
            onSendMessage(text.trim());
            setText('');
        }
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
        // Auto-resize textarea
        if (textAreaRef.current) {
            textAreaRef.current.style.height = 'auto';
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
        }
    }

    const isInputDisabled = isSending || isListening;

    const textAreaClasses = `
        w-full bg-slate-800 border text-gray-200 rounded-2xl p-3 pr-14 resize-none 
        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 
        transition-all duration-200 shadow-inner
        ${isListening 
            ? 'border-red-500/50 ring-2 ring-red-500/20 animate-pulse' 
            : 'border-slate-700'
        }
    `;

    return (
        <footer className="p-4 bg-slate-900/70 backdrop-blur-lg border-t border-slate-700/50">
            <div className="max-w-3xl mx-auto flex items-end gap-3">
                <div className="flex-1 relative">
                    <textarea
                        ref={textAreaRef}
                        className={textAreaClasses}
                        placeholder={isListening ? "Listening..." : "Type a message..."}
                        value={text}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyPress}
                        rows={1}
                        disabled={isInputDisabled}
                        style={{maxHeight: '150px'}}
                    />
                    <button
                        onClick={handleSend}
                        className="absolute right-3.5 bottom-2.5 text-gray-400 hover:text-purple-400 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
                        disabled={!text.trim() || isInputDisabled}
                        aria-label="Send message"
                    >
                        <SendIcon />
                    </button>
                </div>
                <MicButton 
                    isListening={isListening}
                    onClick={toggleListening}
                    disabled={isSending}
                />
            </div>
        </footer>
    );
};

export default InputArea;
