import React from 'react';

interface MicButtonProps {
    isListening: boolean;
    onClick: () => void;
    disabled: boolean;
}

const MicButton: React.FC<MicButtonProps> = ({ isListening, onClick, disabled }) => {
    let buttonClasses = 'w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-4 relative shadow-lg';
    let iconClasses = 'fas fa-microphone text-xl';
    
    if (isListening) {
        buttonClasses += ' bg-red-600 text-white focus:ring-red-500 shadow-lg shadow-red-500/50';
    } else {
        buttonClasses += ' bg-gradient-to-br from-purple-600 to-fuchsia-600 text-white hover:from-purple-700 hover:to-fuchsia-700 focus:ring-purple-500/50';
    }
    
    if (disabled) {
        buttonClasses += ' opacity-50 cursor-not-allowed';
    }

    return (
        <button onClick={onClick} className={buttonClasses} disabled={disabled} aria-label="Toggle voice assistant">
            {isListening && <span className="absolute h-full w-full rounded-full bg-red-600 animate-ping opacity-75"></span>}
            <i className={iconClasses}></i>
        </button>
    );
};

export default MicButton;
