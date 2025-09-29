import React, { useState } from 'react';
import { StudySession, SessionStatus, ThemeColors, ThemeMode } from '../types';
import { ClockIcon, SwordIcon, CheckCircleIcon, TrashIcon, PlayIcon } from './Icons';

interface StudySessionItemProps {
  session: StudySession;
  onStart: (session: StudySession) => void;
  onDelete: (id: number) => void;
  onComplete: (id: number) => void;
  isCompleted: boolean;
  theme: ThemeColors;
  themeMode: ThemeMode;
  onDragStart: (id: number) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (id: number) => void;
}

const StudySessionItem: React.FC<StudySessionItemProps> = ({ session, onStart, onDelete, onComplete, isCompleted, theme, themeMode, onDragStart, onDragOver, onDrop }) => {
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  
  const statusStyles = {
    [SessionStatus.PLANNED]: themeMode === 'light' ? 'border-slate-300' : 'border-slate-500',
    [SessionStatus.ACTIVE]: `${theme.border} animate-pulse`,
    [SessionStatus.COMPLETED]: 'border-green-500 opacity-60',
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', session.id.toString());
    onDragStart(session.id);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    onDragOver(e);
    setIsDraggedOver(true);
  };

  const handleDragLeave = () => setIsDraggedOver(false);
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    onDrop(session.id);
    setIsDraggedOver(false);
  };

  const cardBg = themeMode === 'light' ? 'bg-slate-100 hover:bg-slate-200/80' : 'bg-slate-900 hover:bg-slate-800/80';

  return (
    <div 
      draggable={!isCompleted}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`${cardBg} p-4 rounded-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-l-4 ${statusStyles[session.status]} ${!isCompleted ? 'cursor-grab' : ''} ${isDraggedOver ? 'border-t-2 border-t-blue-400' : ''}`}
    >
      <div className="flex-grow">
        <h3 className={`font-bold text-lg ${themeMode === 'light' ? 'text-slate-800' : `${theme.text}/90`} flex items-center gap-2`}>
            <SwordIcon className="w-4 h-4" />
            {session.subject}
        </h3>
        <p className="text-light text-sm">{session.topic}</p>
        <div className="flex items-center gap-2 mt-2 text-light">
          <ClockIcon className="w-4 h-4"/>
          <span>{session.duration} minutes</span>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {!isCompleted && session.status !== SessionStatus.ACTIVE && (
          <>
            <button
              onClick={() => onStart(session)}
              className="p-2 bg-blue-600 hover:bg-blue-500 rounded-full text-white transition-transform transform hover:scale-110"
              title="Begin the Siege"
            >
              <PlayIcon className="w-5 h-5"/>
            </button>
            <button
              onClick={() => onComplete(session.id)}
              className="p-2 bg-green-600 hover:bg-green-500 rounded-full text-white transition-transform transform hover:scale-110"
              title="Claim Victory"
            >
              <CheckCircleIcon className="w-5 h-5"/>
            </button>
          </>
        )}
         <button
          onClick={() => onDelete(session.id)}
          className="p-2 bg-red-800 hover:bg-red-700 rounded-full text-white transition-transform transform hover:scale-110"
          title="Banish to the Wall"
        >
          <TrashIcon className="w-5 h-5"/>
        </button>
      </div>
    </div>
  );
};

export default StudySessionItem;