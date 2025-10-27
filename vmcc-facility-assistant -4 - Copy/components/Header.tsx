import React from 'react';
import LogoutIcon from './icons/LogoutIcon';
import { CurrentUser } from '../types';

interface HeaderProps {
    currentUser: Exclude<CurrentUser, null>;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onLogout }) => {
    return (
        <header className="relative p-4 bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50 shadow-lg text-center flex items-center justify-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 text-transparent bg-clip-text">
                <i className="fas fa-robot mr-2"></i>
                VMCC Facility Assistant
            </h1>

            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-4">
                 <span className="text-sm text-slate-400 capitalize hidden sm:block">
                    {currentUser.username} ({currentUser.role})
                 </span>
                <button 
                    onClick={onLogout} 
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-800/60 hover:bg-slate-700 backdrop-blur-md border border-slate-700 transition-colors shadow-md" 
                    aria-label="Logout"
                >
                    <LogoutIcon />
                </button>
            </div>
        </header>
    );
};

export default Header;