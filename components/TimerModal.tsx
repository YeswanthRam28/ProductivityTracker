import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StudySession, ThemeColors, ThemeMode } from '../types';

interface PomodoroModalProps {
  session: StudySession;
  onClose: () => void;
  onComplete: (id: number, minutesStudied: number) => void;
  onFail: (id: number, minutesStudied: number) => void;
  theme: ThemeColors;
  themeMode: ThemeMode;
}

const FOCUS_DURATION = 25 * 60; // 25 minutes
const BREAK_DURATION = 5 * 60; // 5 minutes

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const PomodoroModal: React.FC<PomodoroModalProps> = ({ session, onClose, onComplete, onFail, theme, themeMode }) => {
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [timeLeft, setTimeLeft] = useState(FOCUS_DURATION);
  const [isRunning, setIsRunning] = useState(true);
  
  const totalDuration = mode === 'focus' ? FOCUS_DURATION : BREAK_DURATION;
  const minutesStudiedRef = useRef(0);
  const intervalRef = useRef<number | null>(null);
  
  const endSession = useCallback((completed = false) => {
      setIsRunning(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
      
      const studied = Math.floor(minutesStudiedRef.current / 60);
      if (completed) {
          onComplete(session.id, studied > session.duration ? session.duration : studied);
      } else {
          onFail(session.id, studied);
      }
  }, [onComplete, onFail, session.id, session.duration]);


  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (mode === 'focus') {
            setMode('break');
            return BREAK_DURATION;
          } else {
            // Cycle complete, end the whole session
            endSession(true);
            return 0;
          }
        }
        return prev - 1;
      });
      if (mode === 'focus') {
          minutesStudiedRef.current += 1;
      }
    }, 1000);

    return () => {
      if(intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, mode, endSession]);

  const progressPercentage = ((totalDuration - timeLeft) / totalDuration) * 100;
  const isFocus = mode === 'focus';
  const progressColor = isFocus ? theme.primary : '#34d399'; // Green for break
  const borderColor = isFocus ? theme.border : 'border-green-400';

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className={`card-bg border-2 ${borderColor} rounded-xl shadow-2xl w-full max-w-md text-center p-8 relative`}>
        <h2 className={`font-got text-3xl ${theme.text} mb-2`}>{isFocus ? 'The Siege is On!' : 'A Moment of Respite'}</h2>
        <p className="text-light mb-6">{isFocus ? `${session.subject}: ${session.topic}` : 'The raven will fly again soon.'}</p>

        <div className="relative w-48 h-48 sm:w-64 sm:h-64 mx-auto mb-6">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              className={themeMode === 'light' ? 'text-slate-200' : 'text-slate-700'}
              strokeWidth="7"
              stroke="currentColor"
              fill="transparent"
              r="45"
              cx="50"
              cy="50"
            />
            <circle
              stroke={progressColor}
              strokeWidth="7"
              fill="transparent"
              r="45"
              cx="50"
              cy="50"
              strokeDasharray={2 * Math.PI * 45}
              strokeDashoffset={2 * Math.PI * 45 * (1 - progressPercentage / 100)}
              transform="rotate(-90 50 50)"
              style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease', strokeLinecap: 'round' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl sm:text-6xl font-bold text-main tracking-widest">{formatTime(timeLeft)}</span>
          </div>
        </div>
        <div className="flex justify-center gap-4">
            <button
                onClick={() => endSession(false)}
                className="bg-red-800 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-md transition-colors duration-200"
                title="End session and claim partial reward"
            >
                End Campaign
            </button>
             <button
                onClick={onClose}
                className={`${themeMode === 'light' ? 'bg-slate-200 hover:bg-slate-300' : 'bg-slate-700 hover:bg-slate-600'} text-light font-bold py-2 px-6 rounded-md transition-colors duration-200`}
            >
                Retreat to Plan
            </button>
        </div>
      </div>
    </div>
  );
};

export default PomodoroModal;