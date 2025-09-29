import React, { useState } from 'react';
import { StudySession, ThemeColors, ThemeMode } from '../types';
import { SwordIcon } from './Icons';

interface StudySessionFormProps {
  onAddSession: (session: Omit<StudySession, 'id' | 'status'>) => void;
  theme: ThemeColors;
  themeMode: ThemeMode;
}

const StudySessionForm: React.FC<StudySessionFormProps> = ({ onAddSession, theme, themeMode }) => {
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !topic.trim() || !duration) {
      alert("A true commander leaves no field blank.");
      return;
    }
    onAddSession({ subject, topic, duration: parseInt(duration, 10) });
    setSubject('');
    setTopic('');
    setDuration('');
  };

  const inputClasses = themeMode === 'light' 
    ? `w-full bg-slate-100 border border-slate-300 rounded-md px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:${theme.border} transition`
    : `w-full bg-slate-900 border border-slate-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:${theme.border} transition`;

  return (
    <div className="card-bg p-6 rounded-lg border border-main shadow-lg">
      <h2 className={`font-got text-2xl ${theme.text} mb-4 text-center`}>Declare a New Campaign</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="subject" className="block text-sm font-bold text-light mb-1">Realm of Knowledge (Subject)</label>
          <input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. History of Valyria"
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="topic" className="block text-sm font-bold text-light mb-1">Scroll of Wisdom (Topic)</label>
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. The Doom of Valyria"
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="duration" className="block text-sm font-bold text-light mb-1">Hours of Vigil (Duration in Minutes)</label>
          <input
            id="duration"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="e.g. 25"
            min="1"
            className={inputClasses}
          />
        </div>
        <button
          type="submit"
          className={`w-full flex items-center justify-center gap-2 ${theme.accent} ${theme.accentHover} text-white font-bold py-2 px-4 rounded-md transition-transform transform hover:scale-105 duration-200 ease-in-out font-got tracking-wider`}
        >
          <SwordIcon className="w-5 h-5" />
          Forge the Path
        </button>
      </form>
    </div>
  );
};

export default StudySessionForm;