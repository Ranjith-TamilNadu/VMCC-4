import React, { useState, useMemo } from 'react';
import { Problem, ProblemStatus, ProblemPriority } from '../types';
import SearchIcon from './icons/SearchIcon';
import TrashIcon from './icons/TrashIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';
import CalendarIcon from './icons/CalendarIcon';

interface ProblemTrackingModalProps {
    isOpen: boolean;
    onClose: () => void;
    problems: Problem[];
    onDelete: (id: string) => void;
    onUpdateStatus: (id: string, status: ProblemStatus) => void;
    onClearResolved: () => void;
}

const statusColors: { [key in ProblemStatus]: string } = {
    Reported: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    'In Progress': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    Resolved: 'bg-green-500/20 text-green-300 border-green-500/30',
    Closed: 'bg-slate-600/30 text-slate-400 border-slate-600/40',
};

const priorityColors: { [key in Problem['priority']]: string } = {
    Low: 'bg-gray-500',
    Medium: 'bg-yellow-500',
    High: 'bg-red-500',
};

const ProblemItem: React.FC<{ problem: Problem; onDelete: (id: string) => void; onUpdateStatus: (id: string, status: ProblemStatus) => void; }> = ({ problem, onDelete, onUpdateStatus }) => {
    
    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onUpdateStatus(problem.id, e.target.value as ProblemStatus);
    };

    return (
        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50 shadow-md flex flex-col gap-3">
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                         <span className={`w-3 h-3 rounded-full ${priorityColors[problem.priority]}`}></span>
                        <h3 className="font-bold text-white">{problem.location}</h3>
                        <span className="text-xs text-slate-400 font-mono">({problem.id})</span>
                    </div>
                    <p className="text-sm text-slate-300">{problem.description}</p>
                </div>
                <button onClick={() => onDelete(problem.id)} className="text-slate-400 hover:text-red-400 transition-colors p-1 rounded-full hover:bg-slate-700">
                    <TrashIcon />
                </button>
            </div>
             <div className="flex justify-between items-center text-xs text-slate-400 border-t border-slate-600/50 pt-3">
                <div className="flex items-center gap-1.5">
                    <CalendarIcon />
                    <span>{new Date(problem.reportedAt).toLocaleString()}</span>
                </div>
                <div className="relative">
                    <select
                        value={problem.status}
                        onChange={handleStatusChange}
                        className={`appearance-none text-xs rounded-full px-3 py-1 border font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-purple-500 ${statusColors[problem.status]}`}
                    >
                        {(Object.keys(statusColors) as ProblemStatus[]).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
                </div>
            </div>
        </div>
    );
};

const ProblemTrackingModal: React.FC<ProblemTrackingModalProps> = ({ isOpen, onClose, problems, onDelete, onUpdateStatus, onClearResolved }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<ProblemStatus | 'all'>('all');
    const [selectedPriority, setSelectedPriority] = useState<ProblemPriority | 'all'>('all');
    
    const filteredProblems = useMemo(() => {
        return problems.filter(p => {
            const matchesSearchTerm = (
                p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.id.toLowerCase().includes(searchTerm.toLowerCase())
            );

            const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;
            const matchesPriority = selectedPriority === 'all' || p.priority === selectedPriority;

            return matchesSearchTerm && matchesStatus && matchesPriority;
        });
    }, [problems, searchTerm, selectedStatus, selectedPriority]);
    
    const hasResolvedOrClosedTickets = useMemo(() => {
        return problems.some(p => p.status === 'Resolved' || p.status === 'Closed');
    }, [problems]);

    const handleClearResolved = () => {
        if (window.confirm('Are you sure you want to permanently delete all resolved and closed tickets? This action cannot be undone.')) {
            onClearResolved();
        }
    };

    if (!isOpen) return null;
    
    const selectClasses = "w-full bg-slate-900 border border-slate-700 text-white rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500";


    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity" onClick={onClose}>
            <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-6 w-full max-w-3xl m-4 relative animate-fade-in-slide-up flex flex-col h-[80vh]" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-3 right-3 text-slate-400 hover:text-white transition rounded-full w-8 h-8 flex items-center justify-center hover:bg-slate-700">
                     <i className="fas fa-times text-xl"></i>
                </button>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">Problem Tickets</h2>
                    {hasResolvedOrClosedTickets && (
                        <button
                            onClick={handleClearResolved}
                            className="bg-red-600/80 hover:bg-red-700 text-white font-semibold py-1.5 px-3 rounded-md text-sm transition-colors flex items-center gap-2"
                        >
                            <TrashIcon />
                            Clear Resolved
                        </button>
                    )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                    <div className="relative md:col-span-3">
                        <input
                            type="text"
                            placeholder="Search by location, description, or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 text-white rounded-md p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                    </div>
                    <div>
                        <label htmlFor="status-filter" className="text-xs font-medium text-slate-400 mb-1 block">Status</label>
                         <select id="status-filter" value={selectedStatus} onChange={e => setSelectedStatus(e.target.value as ProblemStatus | 'all')} className={selectClasses}>
                            <option value="all">All Statuses</option>
                            {(Object.keys(statusColors) as ProblemStatus[]).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="priority-filter" className="text-xs font-medium text-slate-400 mb-1 block">Priority</label>
                        <select id="priority-filter" value={selectedPriority} onChange={e => setSelectedPriority(e.target.value as ProblemPriority | 'all')} className={selectClasses}>
                            <option value="all">All Priorities</option>
                            {(Object.keys(priorityColors) as ProblemPriority[]).map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
                    {filteredProblems.length > 0 ? (
                        filteredProblems.map(problem => (
                            <ProblemItem key={problem.id} problem={problem} onDelete={onDelete} onUpdateStatus={onUpdateStatus} />
                        ))
                    ) : (
                        <div className="text-center py-10 text-slate-400">
                            <p>{problems.length === 0 ? "No problems have been reported yet." : "No matching problems found."}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProblemTrackingModal;