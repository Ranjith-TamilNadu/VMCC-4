import React, { useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import Message from './Message';

interface ChatWindowProps {
    messages: ChatMessage[];
    isLoading: boolean;
    onReaction: (messageId: string, emoji: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading, onReaction }) => {
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    return (
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-2 custom-scrollbar chat-bg-pattern">
            {messages.map((msg) => (
                <Message 
                    key={msg.id} 
                    message={msg} 
                    onReaction={(emoji) => onReaction(msg.id, emoji)}
                />
            ))}
            {isLoading && <Message message={{ id: 'typing-indicator', sender: 'bot', text: '' }} isTyping={true} onReaction={() => {}} />}
            <div ref={chatEndRef} />
        </main>
    );
};

export default ChatWindow;