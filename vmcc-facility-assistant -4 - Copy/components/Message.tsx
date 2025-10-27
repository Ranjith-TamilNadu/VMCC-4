import React, { useState } from 'react';
import { ChatMessage } from '../types';
import BotIcon from './icons/BotIcon';
import ErrorIcon from './icons/ErrorIcon';
import CopyIcon from './icons/CopyIcon';
import CheckIcon from './icons/CheckIcon';
import EmojiIcon from './icons/EmojiIcon';
import EmojiPicker from './EmojiPicker';
import UserIcon from './icons/UserIcon';


interface MessageProps {
    message: ChatMessage;
    isTyping?: boolean;
    onReaction: (emoji: string) => void;
}

const Message: React.FC<MessageProps> = ({ message, isTyping = false, onReaction }) => {
    const [isCopied, setIsCopied] = useState(false);
    const [pickerVisible, setPickerVisible] = useState(false);

    const handleCopy = (e?: React.MouseEvent) => {
        e?.stopPropagation(); 
        if (isTyping || !message.text) return;

        navigator.clipboard.writeText(message.text).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000); 
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    };
    
    const isBot = message.sender === 'bot';
    
    const isError = isBot && !isTyping && (
        message.text.toLowerCase().includes("sorry") || 
        message.text.toLowerCase().includes("error") ||
        message.text.toLowerCase().includes("having trouble")
    );

    const iconContainerClasses = `flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
        isError ? 'bg-rose-600' : 
        isBot ? 'bg-indigo-500' : 
        'bg-purple-500'
    }`;
    
    const messageBubbleClasses = `px-4 py-3 rounded-2xl shadow-md group relative ${!isTyping ? 'cursor-pointer' : ''} ${
        isTyping || (isBot && !isError)
            ? 'bg-slate-700 text-gray-200 rounded-tl-none border border-slate-600'
            : isError 
                ? 'bg-rose-900/50 text-rose-100 rounded-tl-none border border-rose-700/60' 
                : 'bg-gradient-to-br from-purple-600 to-fuchsia-600 text-white rounded-tr-none'
    }`;
    
    const hasReactions = message.reactions && Object.keys(message.reactions).length > 0;

    const TypingIndicatorDots = () => (
         <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
            <span className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
            <span className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-pulse"></span>
        </div>
    );

    return (
        <div className={`flex flex-col animate-fade-in-slide-up ${isBot ? 'items-start' : 'items-end'}`}>
            <div className={`flex items-start gap-3 max-w-xl ${isBot ? '' : 'flex-row-reverse'}`}>
                <div className={iconContainerClasses}>
                    {isError ? <ErrorIcon /> : isBot ? <BotIcon /> : <UserIcon className="h-6 w-6 text-white"/>}
                </div>
                <div className={messageBubbleClasses} onClick={() => !isTyping && handleCopy()}>
                    {isTyping ? <TypingIndicatorDots /> : <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap pr-16">{message.text}</p>}
                    {!isTyping && (
                         <div className="absolute top-1 right-1.5">
                             <div className="relative flex items-center gap-0.5 rounded-full bg-slate-800/60 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                     onClick={(e) => { e.stopPropagation(); setPickerVisible(!pickerVisible); }}
                                     className="p-1.5 rounded-full text-white/70 hover:bg-white/20 transition-colors"
                                     aria-label="Add reaction"
                                 >
                                     <EmojiIcon />
                                 </button>
                                 <button
                                     onClick={handleCopy}
                                     className="p-1.5 rounded-full text-white/70 hover:bg-white/20 transition-colors"
                                     aria-label={isCopied ? "Copied!" : "Copy message"}
                                 >
                                     {isCopied ? <CheckIcon className="text-green-400" /> : <CopyIcon />}
                                 </button>
                             </div>
                             {pickerVisible && (
                                 <EmojiPicker
                                     onSelect={(emoji) => {
                                         onReaction(emoji);
                                         setPickerVisible(false);
                                     }}
                                 />
                             )}
                         </div>
                    )}
                </div>
            </div>
             {hasReactions && (
                <div className={`flex gap-1.5 mt-1.5 ${isBot ? 'ml-12' : 'mr-12'}`}>
                    {Object.entries(message.reactions!).map(([emoji, count]) => (
                        <button
                            key={emoji}
                            onClick={() => onReaction(emoji)}
                            className="bg-slate-700/80 hover:bg-slate-600 border border-slate-600/50 rounded-full px-2 py-0.5 text-xs flex items-center gap-1 transition-transform active:scale-95"
                            aria-label={`React with ${emoji}`}
                        >
                            <span>{emoji}</span>
                            <span className="font-semibold text-slate-300">{count}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Message;