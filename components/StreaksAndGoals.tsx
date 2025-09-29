import React, { useState } from 'react';
import { Goal, ThemeColors, ThemeMode, UserProfile } from '../types';
import { FlameIcon, TrashIcon, CheckCircleIcon, ShieldIcon } from './Icons';

interface StreaksAndGoalsProps {
  streak: number;
  goals: Goal[];
  onAddGoal: (text: string) => void;
  onToggleGoal: (id: number) => void;
  onDeleteGoal: (id: number) => void;
  theme: ThemeColors;
  themeMode: ThemeMode;
  userProfile: UserProfile;
}

const StreaksAndGoals: React.FC<StreaksAndGoalsProps> = ({ streak, goals, onAddGoal, onToggleGoal, onDeleteGoal, theme, themeMode, userProfile }) => {
    const [newGoal, setNewGoal] = useState('');

    const handleAddGoal = (e: React.FormEvent) => {
        e.preventDefault();
        if (newGoal.trim()) {
            onAddGoal(newGoal.trim());
            setNewGoal('');
        }
    };
    
    const inputClasses = themeMode === 'light' 
        ? `flex-grow bg-slate-100 border border-slate-300 rounded-md px-3 py-1.5 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:${theme.border} transition`
        : `flex-grow bg-slate-900 border border-slate-600 rounded-md px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:${theme.border} transition`;

    return (
        <div className="card-bg p-6 rounded-lg border-main border shadow-lg">
            <h2 className={`font-got text-2xl ${theme.text} mb-4 text-center`}>The Long Watch</h2>
            
            <div className="flex items-center justify-center gap-4 bg-main p-4 rounded-lg mb-6">
                <div className="flex items-center gap-4 flex-grow">
                    <FlameIcon className={`w-10 h-10 ${theme.text}`} />
                    <div>
                        <div className="text-3xl font-bold text-main">{streak}</div>
                        <div className="text-sm text-light -mt-1">{streak === 1 ? 'Day Streak' : 'Day Streak'}</div>
                    </div>
                </div>
                <div className="border-l border-main h-12"></div>
                <div className="flex items-center gap-2 px-4" title={`${userProfile.streakFreezes} streak freezes remaining`}>
                     <ShieldIcon className={`w-8 h-8 text-light`} />
                     <div className="text-2xl font-bold text-main">{userProfile.streakFreezes}</div>
                </div>
            </div>

            <div>
                <h3 className={`font-got text-lg ${theme.text} mb-3`}>Oaths to Keep</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                    {goals.map(goal => (
                        <div key={goal.id} className={`flex items-center justify-between ${themeMode === 'light' ? 'bg-slate-100' : 'bg-slate-900'} p-2 rounded-md group`}>
                            <span 
                                onClick={() => onToggleGoal(goal.id)}
                                className={`flex-grow cursor-pointer ${goal.completed ? 'line-through text-slate-500' : 'text-main'}`}
                            >
                                {goal.text}
                            </span>
                            <div className="flex items-center">
                                {goal.completed && <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />}
                                <button
                                    onClick={() => onDeleteGoal(goal.id)}
                                    className="p-1 text-slate-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Abandon Oath"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {goals.length === 0 && <p className="text-slate-500 text-sm text-center">No oaths sworn.</p>}
                </div>
                <form onSubmit={handleAddGoal} className="flex gap-2 mt-4">
                    <input 
                        type="text"
                        value={newGoal}
                        onChange={(e) => setNewGoal(e.target.value)}
                        placeholder="Swear a new oath..."
                        className={inputClasses}
                    />
                    <button type="submit" className={`px-3 py-1.5 ${theme.accent} ${theme.accentHover} text-white font-bold rounded-md text-sm transition`}>Swear</button>
                </form>
            </div>
        </div>
    );
};

export default StreaksAndGoals;