import React from 'react';
import BotIcon from './icons/BotIcon';

const LoadingIndicator: React.FC = () => {
    return (
        <div className="flex items-start gap-3 max-w-xl mr-auto animate-fade-in-slide-up">
            <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-indigo-500 shadow-lg">
                <BotIcon />
            </div>
            <div className="px-4 py-3 rounded-2xl bg-slate-700 rounded-tl-none flex items-center space-x-2 border border-slate-600">
                <span className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                <span className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                <span className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-pulse"></span>
            </div>
        </div>
    );
};

export default LoadingIndicator;