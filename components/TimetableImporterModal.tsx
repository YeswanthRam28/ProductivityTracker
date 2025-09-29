import React, { useState, useCallback } from 'react';
import { StudySession, ThemeColors, ThemeMode } from '../types';
import { UploadIcon } from './Icons';

type ParsedSession = Omit<StudySession, 'id' | 'status'>;

interface TimetableImporterModalProps {
    onClose: () => void;
    onImport: (sessions: ParsedSession[]) => void;
    theme: ThemeColors;
    themeMode: ThemeMode;
}

const TimetableImporterModal: React.FC<TimetableImporterModalProps> = ({ onClose, onImport, theme, themeMode }) => {
    const [parsedSessions, setParsedSessions] = useState<ParsedSession[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>('');

    const parseCSV = (content: string): ParsedSession[] => {
        const rows = content.split('\n').filter(row => row.trim() !== '');
        if (rows.length < 2) throw new Error("CSV must have a header row and at least one data row.");
        
        const header = rows[0].split(',').map(h => h.trim().toLowerCase());
        const subjectIndex = header.indexOf('subject');
        const topicIndex = header.indexOf('topic');
        const durationIndex = header.indexOf('duration');

        if (subjectIndex === -1 || topicIndex === -1 || durationIndex === -1) {
            throw new Error("CSV header must contain 'subject', 'topic', and 'duration'.");
        }

        return rows.slice(1).map((row, i) => {
            const values = row.split(',');
            const duration = parseInt(values[durationIndex], 10);
            if (isNaN(duration) || duration <= 0) {
                 throw new Error(`Invalid duration on row ${i + 2}. Duration must be a positive number.`);
            }
            return {
                subject: values[subjectIndex]?.trim() || 'Untitled',
                topic: values[topicIndex]?.trim() || 'No Topic',
                duration,
            };
        });
    };

    const parseJSON = (content: string): ParsedSession[] => {
        const data = JSON.parse(content);
        if (!Array.isArray(data)) throw new Error("JSON must be an array of session objects.");
        
        return data.map((item, i) => {
             if (!item.subject || !item.topic || !item.duration) {
                throw new Error(`Invalid session object at index ${i}. Must include 'subject', 'topic', and 'duration'.`);
            }
            const duration = parseInt(item.duration, 10);
            if (isNaN(duration) || duration <= 0) {
                throw new Error(`Invalid duration for session at index ${i}. Must be a positive number.`);
            }
            return { subject: item.subject, topic: item.topic, duration };
        });
    };

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        setParsedSessions([]);
        setFileName('');
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                const content = event.target?.result as string;
                if (file.type === 'application/json') {
                    setParsedSessions(parseJSON(content));
                } else if (file.type === 'text/csv') {
                    setParsedSessions(parseCSV(content));
                } else {
                    throw new Error("Unsupported file type. Please upload a .json or .csv file.");
                }
            } catch (err: any) {
                setError(err.message);
            }
        };
        
        reader.onerror = () => setError("Failed to read the file.");

        reader.readAsText(file);
    }, []);
    
    const handleImport = () => {
        if(parsedSessions.length > 0) {
            onImport(parsedSessions);
            onClose();
        }
    }

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className={`card-bg border-2 ${theme.border} rounded-xl shadow-2xl w-full max-w-2xl text-left p-8 relative`}>
                <h2 className={`font-got text-3xl ${theme.text} mb-4`}>Import War Council Plans</h2>
                <p className="text-light mb-6">Upload your timetable as a JSON or CSV file. The columns must be named `subject`, `topic`, and `duration` (in minutes).</p>
                
                <div className="mb-4">
                    <label htmlFor="file-upload" className={`w-full flex flex-col items-center justify-center p-6 border-2 ${theme.border} border-dashed rounded-lg cursor-pointer ${themeMode === 'light' ? 'hover:bg-slate-100' : 'hover:bg-slate-800/50'}`}>
                        <UploadIcon className={`w-10 h-10 ${theme.text} mb-3`} />
                        <p className="text-light text-sm"><span className="font-semibold text-main">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-light">JSON or CSV</p>
                        {fileName && <p className="text-xs text-green-400 mt-2">{fileName}</p>}
                    </label>
                    <input id="file-upload" type="file" className="hidden" accept=".json,.csv" onChange={handleFileChange} />
                </div>
                
                {error && <div className="bg-red-900/50 border border-red-500 text-red-300 p-3 rounded-md text-sm mb-4">{error}</div>}

                {parsedSessions.length > 0 && (
                    <>
                        <h3 className="font-got text-xl text-main mb-2">Campaigns to be Declared:</h3>
                        <div className="max-h-60 overflow-y-auto space-y-2 p-3 rounded-md bg-main border border-main">
                            {parsedSessions.map((session, index) => (
                                <div key={index} className={`p-2 rounded-md ${themeMode === 'light' ? 'bg-slate-200' : 'bg-slate-800'}`}>
                                    <p className="font-bold text-main">{session.subject}: <span className="font-normal text-light">{session.topic}</span></p>
                                    <p className="text-xs text-light">{session.duration} minutes</p>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                <div className="flex justify-end gap-4 mt-8">
                    <button onClick={onClose} className={`${themeMode === 'light' ? 'bg-slate-200 hover:bg-slate-300' : 'bg-slate-700 hover:bg-slate-600'} text-main font-bold py-2 px-6 rounded-md transition-colors`}>
                        Cancel
                    </button>
                    <button 
                        onClick={handleImport} 
                        disabled={parsedSessions.length === 0 || !!error}
                        className={`w-48 ${theme.accent} ${theme.accentHover} text-white font-bold py-2 px-6 rounded-md transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed`}
                    >
                        Import {parsedSessions.length > 0 ? `(${parsedSessions.length})` : ''}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TimetableImporterModal;
