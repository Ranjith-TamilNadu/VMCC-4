import React from 'react';
import BotIcon from './icons/BotIcon';
import UserIcon from './icons/UserIcon';
import AdminIcon from './icons/AdminIcon';

interface RoleSelectionPageProps {
    onSelectRole: (role: 'student' | 'admin') => void;
}

const RoleSelectionPage: React.FC<RoleSelectionPageProps> = ({ onSelectRole }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 chat-bg-pattern text-white p-4">
            <div className="w-full max-w-sm bg-slate-800/60 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl p-8 text-center animate-fade-in-slide-up">
                <div className="mx-auto mb-4 w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                    <BotIcon className="w-10 h-10" />
                </div>
                <h1 className="text-2xl font-bold mb-1 text-center bg-gradient-to-r from-purple-400 to-indigo-400 text-transparent bg-clip-text">
                    VMCC Facility Assistant
                </h1>
                <p className="text-slate-400 mb-8 text-center text-sm">Please select your role to continue.</p>
                
                <div className="space-y-4">
                    <button 
                        onClick={() => onSelectRole('student')}
                        className="w-full flex items-center justify-center gap-3 font-semibold py-4 px-6 rounded-xl bg-slate-700 hover:bg-slate-600 border border-slate-600 text-slate-200 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-slate-500/50"
                    >
                        <UserIcon className="w-6 h-6" />
                        <span>Student Portal</span>
                    </button>
                    <button 
                        onClick={() => onSelectRole('admin')}
                        className="w-full flex items-center justify-center gap-3 font-semibold py-4 px-6 rounded-xl bg-slate-700 hover:bg-slate-600 border border-slate-600 text-slate-200 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-slate-500/50"
                    >
                        <AdminIcon />
                        <span>Admin Portal</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoleSelectionPage;
