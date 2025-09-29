import React from 'react';
import { House, ThemeColors, ThemeMode } from '../types';
import { CrownIcon, StarkSigil, LannisterSigil, TargaryenSigil, CalendarIcon } from './Icons';
import ThemeSwitcher from './ThemeSwitcher';

interface HeaderProps {
    house: House;
    onSigilClick: () => void;
    theme: ThemeColors;
    themeMode: ThemeMode;
    setThemeMode: (mode: ThemeMode) => void;
    onOpenReport: () => void;
}

const HouseSigil: React.FC<{ house: House; className: string }> = ({ house, className }) => {
    switch (house) {
        case House.STARK: return <StarkSigil className={className} />;
        case House.LANNISTER: return <LannisterSigil className={className} />;
        case House.TARGARYEN: return <TargaryenSigil className={className} />;
        default: return <CrownIcon className={className} />;
    }
};


const Header: React.FC<HeaderProps> = ({ house, onSigilClick, theme, themeMode, setThemeMode, onOpenReport }) => {
  return (
    <header className={`text-center py-4 border-b-2 ${themeMode === 'light' ? 'border-slate-200' : `${theme.border}/30`}`}>
      <div className="flex items-center justify-between">
        <div className="w-48 hidden sm:block"></div>
        <div className="flex items-center justify-center gap-4 flex-grow">
          <HouseSigil house={house} className={`w-10 h-10 ${theme.text} transform -rotate-12`} />
          <h1 
              className={`text-4xl sm:text-5xl md:text-6xl font-got ${theme.text} tracking-wider cursor-pointer transition-colors hover:text-white`}
              onClick={onSigilClick}
              title="Return to the Unsworn"
          >
            The Scholar's Throne
          </h1>
          <HouseSigil house={house} className={`w-10 h-10 ${theme.text} transform rotate-12`} />
        </div>
        <div className="w-48 flex items-center justify-end gap-2">
            <button onClick={onOpenReport} title="Weekly Report" className="p-2 rounded-full hover:bg-slate-700 transition-colors">
                <CalendarIcon className={`w-6 h-6 text-light`} />
            </button>
            <ThemeSwitcher themeMode={themeMode} setThemeMode={setThemeMode} />
        </div>
      </div>
      <p className="mt-2 text-light text-sm sm:text-base italic">
        "A mind needs books as a sword needs a whetstone, if it is to keep its edge."
      </p>
    </header>
  );
};

export default Header;