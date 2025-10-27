import React, { useState, FormEvent } from 'react';
import BotIcon from './icons/BotIcon';
import UserIcon from './icons/UserIcon';
import LockIcon from './icons/LockIcon';
import { User } from '../types';
import ArrowLeftIcon from './icons/ArrowLeftIcon';

interface AuthPageProps {
    onLogin: (username: string, password: string) => { success: boolean, message: string };
    onRegister: (user: Omit<User, 'password'>, password: string) => { success: boolean, message: string };
    initialRole: 'student' | 'admin';
    onBack: () => void;
    onForgotPassword: () => void;
}

const ADMIN_CODE = 'VMCC-ADMIN-2024';

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onRegister, initialRole, onBack, onForgotPassword }) => {
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [adminCode, setAdminCode] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleLoginSubmit = (e: FormEvent) => {
        e.preventDefault();
        setMessage(null);
        if (!username || !password) {
            setMessage({ type: 'error', text: 'Please fill in all fields.' });
            return;
        }
        const result = onLogin(username, password);
        if (!result.success) {
            setMessage({ type: 'error', text: result.message });
        }
    };

    const handleRegisterSubmit = (e: FormEvent) => {
        e.preventDefault();
        setMessage(null);
        if (!username || !password) {
            setMessage({ type: 'error', text: 'Please fill in all fields.' });
            return;
        }
        if (initialRole === 'admin' && adminCode !== ADMIN_CODE) {
            setMessage({ type: 'error', text: 'Invalid Admin Code.' });
            return;
        }
        const result = onRegister({ username, role: initialRole }, password);
        if (result.success) {
            setMessage({ type: 'success', text: result.message });
            setUsername('');
            setPassword('');
            setAdminCode('');
            setActiveTab('login');
        } else {
            setMessage({ type: 'error', text: result.message });
        }
    };
    
    const renderMessage = () => {
        if (!message) return null;
        const baseClasses = 'text-sm text-center p-2 rounded-md mb-4';
        const typeClasses = message.type === 'success'
            ? 'bg-green-500/20 text-green-300'
            : 'bg-red-500/20 text-red-300';
        return <div className={`${baseClasses} ${typeClasses}`}>{message.text}</div>;
    };
    
    const TabButton: React.FC<{tab: 'login' | 'register', label: string}> = ({tab, label}) => (
         <button
            onClick={() => { setActiveTab(tab); setMessage(null); }}
            className={`w-1/2 py-2.5 text-sm font-semibold rounded-md focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 ${
                activeTab === tab 
                ? 'bg-purple-600 text-white' 
                : 'text-slate-300 hover:bg-slate-700'
            }`}
        >
            {label}
        </button>
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 chat-bg-pattern text-white p-4">
            <div className="w-full max-w-sm bg-slate-800/60 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl p-8 animate-fade-in-slide-up relative">
                <button onClick={onBack} className="absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center bg-slate-800/60 hover:bg-slate-700 backdrop-blur-md border border-slate-700 transition-colors shadow-md z-10" aria-label="Go back">
                    <ArrowLeftIcon />
                </button>
                <div className="mx-auto mb-4 w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                    <BotIcon className="w-10 h-10" />
                </div>
                <h1 className="text-2xl font-bold mb-1 text-center bg-gradient-to-r from-purple-400 to-indigo-400 text-transparent bg-clip-text capitalize">
                     {initialRole} Portal
                </h1>
                <p className="text-slate-400 mb-6 text-center text-sm">Welcome! Please sign in or register.</p>

                <div className="bg-slate-900/50 rounded-lg p-1 flex mb-6">
                   <TabButton tab="login" label="Login" />
                   <TabButton tab="register" label="Register" />
                </div>

                {renderMessage()}

                {activeTab === 'login' ? (
                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                        <div className="relative">
                             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><UserIcon className="w-5 h-5"/></span>
                            <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ease-in-out focus:border-purple-500 focus:shadow-lg focus:shadow-purple-500/20" />
                        </div>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><LockIcon className="w-5 h-5"/></span>
                            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ease-in-out focus:border-purple-500 focus:shadow-lg focus:shadow-purple-500/20" />
                        </div>
                        <div className="text-right">
                             <button type="button" onClick={onForgotPassword} className="text-sm text-purple-400 hover:text-purple-300 hover:underline transition-colors">
                                Forgot Password?
                            </button>
                        </div>
                        <button type="submit" className="w-full font-semibold py-3 px-6 rounded-xl bg-gradient-to-br from-purple-600 to-fuchsia-600 text-white hover:from-purple-700 hover:to-fuchsia-700 transition-all transform duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500/50">
                            Sign In
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleRegisterSubmit} className="space-y-4">
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><UserIcon className="w-5 h-5"/></span>
                            <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ease-in-out focus:border-purple-500 focus:shadow-lg focus:shadow-purple-500/20" />
                        </div>
                         <div className="relative">
                             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><LockIcon className="w-5 h-5"/></span>
                            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ease-in-out focus:border-purple-500 focus:shadow-lg focus:shadow-purple-500/20" />
                        </div>

                        {initialRole === 'admin' && (
                            <div className="relative animate-fade-in-slide-up" style={{animationDuration: '0.3s'}}>
                                <input type="text" placeholder="Admin Code" value={adminCode} onChange={e => setAdminCode(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300 ease-in-out focus:border-amber-500 focus:shadow-lg focus:shadow-amber-500/20" />
                            </div>
                        )}
                        <button type="submit" className="w-full font-semibold py-3 px-6 rounded-xl bg-slate-700 hover:bg-slate-600 border border-slate-600 text-slate-200 transition-all transform duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-slate-500/50">
                            Create Account
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AuthPage;