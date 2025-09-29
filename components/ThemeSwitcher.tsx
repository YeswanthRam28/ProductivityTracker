import React from 'react';
import { ThemeMode } from '../types';
import { SunIcon, MoonIcon, CrownIcon } from './Icons';

interface ThemeSwitcherProps {
    themeMode: ThemeMode;
    setThemeMode: (mode: ThemeMode) => void;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ themeMode, setThemeMode }) => {
    return (
        <div className="flex items-center gap-1 p-1 rounded-full bg-slate-800">
            <button 
                onClick={() => setThemeMode('light')} 
                className={`p-1.5 rounded-full transition-colors ${themeMode === 'light' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:bg-slate-700'}`}
                title="Light Mode"
            >
                <SunIcon className="w-4 h-4" />
            </button>
            <button 
                onClick={() => setThemeMode('dark')} 
                className={`p-1.5 rounded-full transition-colors ${themeMode === 'dark' ? 'bg-amber-500 text-slate-900' : 'text-slate-400 hover:bg-slate-700'}`}
                title="GOT Mode"
            >
                <CrownIcon className="w-4 h-4" />
            </button>
        </div>
    );
};

export default ThemeSwitcher;
