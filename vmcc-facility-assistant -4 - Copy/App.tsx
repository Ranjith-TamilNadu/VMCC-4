import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import InputArea from './components/InputArea';
import SettingsModal from './components/SettingsModal';
import ProblemTrackingModal from './components/ProblemTrackingModal';
import ClipboardListIcon from './components/icons/ClipboardListIcon';
import SettingsIcon from './components/icons/SettingsIcon';
import AuthPage from './components/AuthPage';
import { ChatMessage, Problem, ProblemPriority, User, CurrentUser } from './types';
import { generateTextResponse } from './services/geminiService';
import { useSpeechRecognition } from './hooks/useVoiceAssistant';
import RoleSelectionPage from './components/RoleSelectionPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';

const INITIAL_MESSAGE: ChatMessage = {
    id: 'initial-message',
    sender: 'bot',
    text: "Hello! I'm the VMCC Facility Assistant. How can I help you today? You can ask me about campus facilities or report a problem.",
};

const App: React.FC = () => {
    // Auth State
    const [users, setUsers] = useState<User[]>([]);
    const [currentUser, setCurrentUser] = useState<CurrentUser>(null);
    const [authRole, setAuthRole] = useState<'student' | 'admin' | null>(null);
    const [isForgotPassword, setIsForgotPassword] = useState(false);


    // App State
    const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
    const [problems, setProblems] = useState<Problem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isProblemsOpen, setIsProblemsOpen] = useState(false);
    
    // Settings state
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoiceURI, setSelectedVoiceURI] = useState<string | null>(null);
    const [speechRate, setSpeechRate] = useState(1);
    
    // Load users from localStorage on initial render
    useEffect(() => {
        try {
            const storedUsers = localStorage.getItem('vmcc-users');
            if (storedUsers) {
                setUsers(JSON.parse(storedUsers));
            } else {
                // For demonstration, create a default admin user if none exist.
                const defaultAdmin: User = { username: 'admin', password: 'password123', role: 'admin' };
                setUsers([defaultAdmin]);
                localStorage.setItem('vmcc-users', JSON.stringify([defaultAdmin]));
            }
        } catch (error) {
            console.error("Failed to load users from localStorage", error);
        }
    }, []);

    const persistUsers = (updatedUsers: User[]) => {
        setUsers(updatedUsers);
        localStorage.setItem('vmcc-users', JSON.stringify(updatedUsers));
    };

    const addMessage = (message: ChatMessage) => {
        setMessages(prev => [...prev, message]);
    };

    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            if (availableVoices.length > 0) {
                setVoices(availableVoices);
                const defaultVoice = availableVoices.find(v => v.default) || availableVoices[0];
                if (defaultVoice) {
                    setSelectedVoiceURI(defaultVoice.voiceURI);
                }
            }
        };
        // onvoiceschanged event is crucial for loading voices reliably
        window.speechSynthesis.onvoiceschanged = loadVoices;
        loadVoices();
    }, []);
    
    const speakText = useCallback((text: string) => {
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }
        const utterance = new SpeechSynthesisUtterance(text);
        const allVoices = window.speechSynthesis.getVoices();
        const selectedVoice = allVoices.find(v => v.voiceURI === selectedVoiceURI);
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }
        utterance.rate = speechRate;
        window.speechSynthesis.speak(utterance);
    }, [selectedVoiceURI, speechRate]);


    const handleSendMessage = async (text: string) => {
        if (isListening) {
            toggleListening();
        }

        const userMessage: ChatMessage = { id: uuidv4(), sender: 'user', text };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const history = [...messages, userMessage];
            const botResponseText = await generateTextResponse(text, history);
            const botMessage: ChatMessage = { id: uuidv4(), sender: 'bot', text: botResponseText };
            setMessages(prev => [...prev, botMessage]);
            speakText(botResponseText);
        } catch (error) {
            console.error("Error sending message:", error);
            const errorText = "Sorry, I'm having trouble connecting to my brain right now. Please try again later.";
            const errorMessage: ChatMessage = { id: uuidv4(), sender: 'bot', text: errorText };
            setMessages(prev => [...prev, errorMessage]);
            speakText(errorText);
        } finally {
            setIsLoading(false);
        }
    };
    
    const { isListening, toggleListening } = useSpeechRecognition(handleSendMessage, isLoading);

    const handleReaction = (messageId: string, emoji: string) => {
        setMessages(messages.map(msg => {
            if (msg.id === messageId) {
                const newReactions = { ...(msg.reactions || {}) };
                newReactions[emoji] = (newReactions[emoji] || 0) + 1;
                return { ...msg, reactions: newReactions };
            }
            return msg;
        }));
    };
    
    const handleClearChat = () => {
        setMessages([INITIAL_MESSAGE]);
        setIsSettingsOpen(false);
    };

    const deleteProblem = (id: string) => {
        setProblems(problems.filter(p => p.id !== id));
    };

    const updateProblemStatus = (id: string, status: Problem['status']) => {
        setProblems(problems.map(p => (p.id === id ? { ...p, status } : p)));
    };
    
    const clearResolvedProblems = () => {
        setProblems(prevProblems => prevProblems.filter(p => p.status !== 'Resolved' && p.status !== 'Closed'));
    };

    // --- Auth Handlers ---
    const handleRegister = (user: Omit<User, 'password'>, password: string): { success: boolean, message: string } => {
        if (users.find(u => u.username.toLowerCase() === user.username.toLowerCase())) {
            return { success: false, message: 'Username already exists.' };
        }
        // In a real app, you would hash the password
        const newUser: User = { ...user, password };
        persistUsers([...users, newUser]);
        return { success: true, message: 'Registration successful! Please log in.' };
    };

    const handleLogin = (username: string, password: string): { success: boolean, message: string } => {
        const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
        // In a real app, you would compare hashed passwords
        if (user && user.password === password) {
            setCurrentUser(user);
            return { success: true, message: 'Login successful!' };
        }
        return { success: false, message: 'Invalid username or password.' };
    };
    
    const handleLogout = () => {
        setCurrentUser(null);
        setAuthRole(null);
        setIsForgotPassword(false);
        setMessages([INITIAL_MESSAGE]);
        setProblems([]); // Reset problems for data safety
    };

    const handlePasswordReset = (username: string, newPassword: string, adminCode?: string): { success: boolean, message: string } => {
        const userIndex = users.findIndex(u => u.username.toLowerCase() === username.toLowerCase());
        if (userIndex === -1) {
            return { success: false, message: 'User not found.' };
        }
    
        const userToUpdate = users[userIndex];
    
        if (userToUpdate.role === 'admin') {
            // This must match the code in AuthPage
            if (adminCode !== 'VMCC-ADMIN-2024') { 
                return { success: false, message: 'Invalid Admin Code.' };
            }
        }
    
        const updatedUsers = [...users];
        updatedUsers[userIndex] = { ...userToUpdate, password: newPassword };
        persistUsers(updatedUsers);
    
        return { success: true, message: 'Password has been reset successfully. Please log in.' };
    };


    if (!currentUser) {
        if (isForgotPassword) {
            return <ForgotPasswordPage 
                onPasswordReset={handlePasswordReset} 
                onBack={() => setIsForgotPassword(false)} 
                users={users} 
            />;
        }
        if (!authRole) {
            return <RoleSelectionPage onSelectRole={setAuthRole} />;
        }
        return <AuthPage 
            onLogin={handleLogin} 
            onRegister={handleRegister}
            initialRole={authRole}
            onBack={() => setAuthRole(null)} 
            onForgotPassword={() => setIsForgotPassword(true)}
        />;
    }

    return (
        <div className="flex flex-col h-screen bg-slate-900 text-gray-200 font-sans antialiased">
            <Header onLogout={handleLogout} currentUser={currentUser} />
            {currentUser.role === 'admin' && (
                <div className="absolute top-4 right-28 flex gap-3 z-10">
                     <button onClick={() => setIsProblemsOpen(true)} className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-800/60 hover:bg-slate-700 backdrop-blur-md border border-slate-700 transition-colors shadow-lg" aria-label="View reported problems">
                        <ClipboardListIcon />
                    </button>
                    <button onClick={() => setIsSettingsOpen(true)} className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-800/60 hover:bg-slate-700 backdrop-blur-md border border-slate-700 transition-colors shadow-lg" aria-label="Open settings">
                        <SettingsIcon />
                    </button>
                </div>
            )}
            <ChatWindow messages={messages} isLoading={isLoading} onReaction={handleReaction} />
            <InputArea
                onSendMessage={handleSendMessage}
                isSending={isLoading}
                isListening={isListening}
                toggleListening={toggleListening}
            />
            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                voices={voices}
                selectedVoiceURI={selectedVoiceURI}
                onVoiceChange={setSelectedVoiceURI}
                speechRate={speechRate}
                onRateChange={setSpeechRate}
                onClearChat={handleClearChat}
            />
            <ProblemTrackingModal
                isOpen={isProblemsOpen}
                onClose={() => setIsProblemsOpen(false)}
                problems={problems}
                onDelete={deleteProblem}
                onUpdateStatus={updateProblemStatus}
                onClearResolved={clearResolvedProblems}
            />
        </div>
    );
};

export default App;
