import React from 'react';

const EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

interface EmojiPickerProps {
    onSelect: (emoji: string) => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelect }) => {
    
    const handleSelect = (e: React.MouseEvent, emoji: string) => {
        e.stopPropagation();
        onSelect(emoji);
    };
    
    return (
        <div 
            className="absolute bottom-full mb-2 right-0 bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-xl p-2 flex gap-1 shadow-2xl z-10 animate-fade-in-slide-up" 
            style={{ animationDuration: '0.15s' }}
            onClick={(e) => e.stopPropagation()} // Prevent bubble click from triggering copy
        >
            {EMOJIS.map(emoji => (
                <button
                    key={emoji}
                    onClick={(e) => handleSelect(e, emoji)}
                    className="text-2xl p-1 rounded-md hover:bg-slate-700 transition-colors"
                    aria-label={`React with ${emoji}`}
                >
                    {emoji}
                </button>
            ))}
        </div>
    );
};

export default EmojiPicker;