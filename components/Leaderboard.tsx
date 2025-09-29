import React from 'react';
import { Friend, House, ThemeColors, ThemeMode } from '../types';
import { CrownIcon, StarkSigil, LannisterSigil, TargaryenSigil, TrophyIcon } from './Icons';

interface LeaderboardProps {
    friends: Friend[];
    theme: ThemeColors;
    themeMode: ThemeMode;
}

const HouseSigil: React.FC<{ house: House; className: string }> = ({ house, className }) => {
    switch (house) {
        case House.STARK: return <StarkSigil className={className} />;
        case House.LANNISTER: return <LannisterSigil className={className} />;
        case House.TARGARYEN: return <TargaryenSigil className={className} />;
        default: return <CrownIcon className={className} />;
    }
};

const houseColors: Record<House, string> = {
    [House.STARK]: 'text-blue-400',
    [House.LANNISTER]: 'text-red-500',
    [House.TARGARYEN]: 'text-rose-500',
    [House.UNSWORN]: 'text-amber-400',
};

const Leaderboard: React.FC<LeaderboardProps> = ({ friends, theme, themeMode }) => {
    const sortedFriends = [...friends].sort((a, b) => b.studyMinutes - a.studyMinutes);
    const rankColors = ['text-yellow-400', 'text-slate-300', 'text-yellow-600'];

    return (
        <div className="card-bg p-6 rounded-lg border-main border shadow-lg">
            <h2 className={`font-got text-2xl ${theme.text} mb-4 text-center flex items-center justify-center gap-3`}>
                <TrophyIcon className="w-6 h-6"/>
                The King's Court
            </h2>
            <ul className="space-y-3">
                {sortedFriends.map((friend, index) => (
                    <li key={friend.id} className={`p-3 rounded-lg flex items-center gap-4 transition-all duration-300 ${friend.isUser ? (themeMode === 'light' ? 'bg-blue-100' : 'bg-blue-900/50') : (themeMode === 'light' ? 'bg-slate-100' : 'bg-slate-900') }`}>
                        <div className={`text-xl font-bold w-6 text-center ${rankColors[index] || 'text-light'}`}>{index + 1}</div>
                        <HouseSigil house={friend.house} className={`w-8 h-8 flex-shrink-0 ${houseColors[friend.house]}`} />
                        <div className="flex-grow">
                            <p className="font-bold text-main">{friend.name}</p>
                            <p className="text-xs text-light">{Math.floor(friend.studyMinutes / 60)}h {friend.studyMinutes % 60}m studied</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Leaderboard;
