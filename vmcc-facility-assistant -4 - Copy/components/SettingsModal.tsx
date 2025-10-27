import React from 'react';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    voices: SpeechSynthesisVoice[];
    selectedVoiceURI: string | null;
    onVoiceChange: (uri: string) => void;
    speechRate: number;
    onRateChange: (rate: number) => void;
    onClearChat: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
    isOpen, 
    onClose,
    voices,
    selectedVoiceURI,
    onVoiceChange,
    speechRate,
    onRateChange,
    onClearChat
}) => {
    if (!isOpen) return null;

    const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onVoiceChange(e.target.value);
    };

    const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onRateChange(parseFloat(e.target.value));
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity" onClick={onClose}>
            <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-6 w-full max-w-md m-4 relative animate-fade-in-slide-up" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-3 right-3 text-slate-400 hover:text-white transition rounded-full w-8 h-8 flex items-center justify-center hover:bg-slate-700">
                    <i className="fas fa-times text-xl"></i>
                </button>
                <h2 className="text-xl font-bold mb-6 text-white">Settings</h2>
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Voice Settings</h3>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="voice-select" className="block text-sm font-medium text-gray-300 mb-2">
                                    Assistant Voice
                                </label>
                                <select
                                    id="voice-select"
                                    value={selectedVoiceURI || ''}
                                    onChange={handleVoiceChange}
                                    className="w-full bg-slate-700 border border-slate-600 text-white rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                >
                                    {voices.length > 0 ? (
                                        voices.map(voice => (
                                            <option key={voice.voiceURI} value={voice.voiceURI}>
                                                {voice.name} ({voice.lang})
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>Loading voices...</option>
                                    )}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="rate-slider" className="block text-sm font-medium text-gray-300 mb-2">
                                    Speech Rate: <span className="font-bold text-purple-400">{speechRate.toFixed(1)}x</span>
                                </label>
                                <input
                                    id="rate-slider"
                                    type="range"
                                    min="0.5"
                                    max="2"
                                    step="0.1"
                                    value={speechRate}
                                    onChange={handleRateChange}
                                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                                />
                            </div>
                        </div>
                    </div>

                    <hr className="border-slate-600" />
                    
                    <div>
                         <h3 className="text-lg font-semibold text-white mb-4">Chat</h3>
                        <button 
                            onClick={onClearChat}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-red-500"
                        >
                            <i className="fas fa-trash-alt mr-2"></i>
                            Clear Chat History
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;