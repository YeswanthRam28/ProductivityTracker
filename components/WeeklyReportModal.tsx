import React, { useMemo } from 'react';
import { StudySession, ThemeColors, ThemeMode } from '../types';
// FIX: Import `CrownIcon` to resolve 'Cannot find name' error.
import { CalendarIcon, ClockIcon, CheckCircleIcon, CrownIcon } from './Icons';

interface WeeklyReportModalProps {
    onClose: () => void;
    sessions: StudySession[];
    theme: ThemeColors;
    themeMode: ThemeMode;
}

const WeeklyReportModal: React.FC<WeeklyReportModalProps> = ({ onClose, sessions, theme, themeMode }) => {

    const reportData = useMemo(() => {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const recentSessions = sessions.filter(s => s.completedAt && new Date(s.completedAt) > oneWeekAgo);
        
        const totalMinutes = recentSessions.reduce((sum, s) => sum + s.duration, 0);
        const subjects: Record<string, number> = {};
        recentSessions.forEach(s => {
            subjects[s.subject] = (subjects[s.subject] || 0) + s.duration;
        });

        const topSubject = Object.entries(subjects).sort((a,b) => b[1] - a[1])[0];

        return {
            totalSessions: recentSessions.length,
            totalMinutes,
            topSubject: topSubject ? topSubject[0] : 'N/A'
        };
    }, [sessions]);


    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className={`card-bg border-2 ${theme.border} rounded-xl shadow-2xl w-full max-w-lg text-center p-8 relative`}>
                <h2 className={`font-got text-3xl ${theme.text} mb-2 flex items-center justify-center gap-3`}><CalendarIcon className="w-7 h-7" />Weekly Communique</h2>
                <p className="text-light mb-6">A summary of your conquests from the past seven days.</p>
                
                <div className="space-y-4 text-left">
                    <div className={`flex items-center gap-4 p-4 rounded-lg ${themeMode === 'light' ? 'bg-slate-100' : 'bg-slate-900'}`}>
                        <CheckCircleIcon className={`w-8 h-8 ${theme.text}`} />
                        <div>
                            <p className="text-2xl font-bold text-main">{reportData.totalSessions}</p>
                            <p className="text-light">Campaigns Completed</p>
                        </div>
                    </div>
                    <div className={`flex items-center gap-4 p-4 rounded-lg ${themeMode === 'light' ? 'bg-slate-100' : 'bg-slate-900'}`}>
                        <ClockIcon className={`w-8 h-8 ${theme.text}`} />
                        <div>
                            <p className="text-2xl font-bold text-main">{Math.floor(reportData.totalMinutes / 60)}h {reportData.totalMinutes % 60}m</p>
                            <p className="text-light">Total Hours of Vigil</p>
                        </div>
                    </div>
                     <div className={`flex items-center gap-4 p-4 rounded-lg ${themeMode === 'light' ? 'bg-slate-100' : 'bg-slate-900'}`}>
                        <CrownIcon className={`w-8 h-8 ${theme.text}`} />
                        <div>
                            <p className="text-2xl font-bold text-main">{reportData.topSubject}</p>
                            <p className="text-light">Most Conquered Realm</p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className={`mt-8 w-full ${theme.accent} ${theme.accentHover} text-white font-bold py-2 px-6 rounded-md transition-colors duration-200`}
                >
                    Return to Battle
                </button>
            </div>
        </div>
    );
};

export default WeeklyReportModal;
