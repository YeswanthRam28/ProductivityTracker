import React, { useState } from 'react';
import { StudySession, ThemeColors, ThemeMode } from '../types';
import StudySessionItem from './StudySessionItem';
import { ScrollIcon } from './Icons';

interface StudySessionListProps {
  sessions: StudySession[];
  title: string;
  onStart: (session: StudySession) => void;
  onDelete: (id: number) => void;
  onComplete: (id: number) => void;
  theme: ThemeColors;
  themeMode: ThemeMode;
  onUpdateOrder: (sessions: StudySession[]) => void;
}

const StudySessionList: React.FC<StudySessionListProps> = ({ sessions, title, onStart, onDelete, onComplete, theme, themeMode, onUpdateOrder }) => {
  const isCompletedList = title.includes("Conquered");
  const [draggedItemId, setDraggedItemId] = useState<number | null>(null);

  const handleDragStart = (id: number) => {
    if (isCompletedList) return;
    setDraggedItemId(id);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (isCompletedList) return;
    e.preventDefault();
  };

  const handleDrop = (targetId: number) => {
    if (isCompletedList || draggedItemId === null || draggedItemId === targetId) {
      setDraggedItemId(null);
      return;
    }

    const draggedIndex = sessions.findIndex(s => s.id === draggedItemId);
    const targetIndex = sessions.findIndex(s => s.id === targetId);

    const newSessions = [...sessions];
    const [draggedItem] = newSessions.splice(draggedIndex, 1);
    newSessions.splice(targetIndex, 0, draggedItem);
    
    onUpdateOrder(newSessions);
    setDraggedItemId(null);
  };
  
  if (sessions.length === 0 && !isCompletedList) {
    return (
        <div className="card-bg p-6 rounded-lg border-main border shadow-lg">
            <h2 className={`font-got text-2xl ${theme.text} mb-4 flex items-center gap-3`}>
                <ScrollIcon className="w-6 h-6"/>
                {title}
            </h2>
            <p className="text-light text-center py-4">No active campaigns. Plan your next conquest!</p>
        </div>
    );
  }
  
  if(isCompletedList && sessions.length === 0) return null;
  
  return (
    <div className="card-bg p-6 rounded-lg border-main border shadow-lg">
      <h2 className={`font-got text-2xl ${theme.text} mb-4 flex items-center gap-3`}>
        <ScrollIcon className="w-6 h-6"/>
        {title}
      </h2>
      <div className="space-y-3">
        {sessions.map(session => (
          <StudySessionItem
            key={session.id}
            session={session}
            onStart={onStart}
            onDelete={onDelete}
            onComplete={onComplete}
            isCompleted={isCompletedList}
            theme={theme}
            themeMode={themeMode}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
        ))}
      </div>
    </div>
  );
};

export default StudySessionList;