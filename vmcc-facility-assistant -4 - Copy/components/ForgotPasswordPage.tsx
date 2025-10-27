import React, { useState, FormEvent } from 'react';
import { User } from '../types';
import KeyIcon from './icons/KeyIcon';
import UserIcon from './icons/UserIcon';
import LockIcon from './icons/LockIcon';
import ArrowLeftIcon from './icons/ArrowLeftIcon';

interface ForgotPasswordPageProps {
    onPasswordReset: (username: string, newPassword: string, adminCode?: string) => { success: boolean, message: string };
    onBack: () => void;
    users: User[];
}

const ADMIN_CODE_CONST = 'VMCC-ADMIN-2024';

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onPasswordReset, onBack, users }) => {
    const [step, setStep] = useState<'findUser' | 'resetPassword'>('findUser');
    const [username, setUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [adminCode, setAdminCode] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [foundUserRole, setFoundUserRole] = useState<'student' | 'admin' | null>(null);

    const handleFindUser = (e: FormEvent) => {
        e.preventDefault();
        setMessage(null);
        const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
        if (user) {
            setFoundUserRole(user.role);
            setStep('resetPassword');
        } else {
            setMessage({ type: 'error', text: 'User not found. Please check the username.' });
        }
    };

    const handleResetPassword = (e: FormEvent) => {
        e.preventDefault();
        setMessage(null);
        if (!newPassword) {
            setMessage({ type: 'error', text: 'Please enter a new password.' });
            return;
        }
        if (foundUserRole === 'admin' && adminCode !== ADMIN_CODE_CONST) {
            setMessage({ type: 'error', text: 'Invalid Admin Code.' });
            return;
        }

        const result = onPasswordReset(username, newPassword, adminCode);
        if (result.success) {
            setMessage({ type: 'success', text: result.message });
            setTimeout(() => {
                onBack();
            }, 2500);
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

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 chat-bg-pattern text-white p-4">
            <div className="w-full max-w-sm bg-slate-800/60 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl p-8 animate-fade-in-slide-up relative">
                <div className="mx-auto mb-4 w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg">
                    <KeyIcon />
                </div>
                <h1 className="text-2xl font-bold mb-1 text-center bg-gradient-to-r from-amber-400 to-orange-400 text-transparent bg-clip-text">
                    Password Reset
                </h1>
                <p className="text-slate-400 mb-6 text-center text-sm">
                    {step === 'findUser' ? 'Enter your username to begin.' : `Resetting password for ${username}.`}
                </p>

                {renderMessage()}

                {step === 'findUser' ? (
                    <form onSubmit={handleFindUser} className="space-y-4">
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><UserIcon className="w-5 h-5"/></span>
                            <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300 ease-in-out focus:border-amber-500 focus:shadow-lg focus:shadow-amber-500/20" />
                        </div>
                        <button type="submit" className="w-full font-semibold py-3 px-6 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700 transition-all transform duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-amber-500/50">
                            Find Account
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><LockIcon className="w-5 h-5"/></span>
                            <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300 ease-in-out focus:border-amber-500 focus:shadow-lg focus:shadow-amber-500/20" />
                        </div>

                        {foundUserRole === 'admin' && (
                            <div className="relative animate-fade-in-slide-up" style={{animationDuration: '0.3s'}}>
                                <input type="text" placeholder="Admin Code" value={adminCode} onChange={e => setAdminCode(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300 ease-in-out focus:border-amber-500 focus:shadow-lg focus:shadow-amber-500/20" />
                                <p className="text-xs text-slate-500 mt-1 pl-1">Admin verification required.</p>
                            </div>
                        )}
                        <button type="submit" className="w-full font-semibold py-3 px-6 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700 transition-all transform duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-amber-500/50">
                            Reset Password
                        </button>
                    </form>
                )}
                 <div className="text-center mt-4">
                    <button onClick={onBack} className="text-sm text-slate-400 hover:text-slate-200 hover:underline transition-colors flex items-center gap-2 mx-auto">
                        <ArrowLeftIcon />
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
