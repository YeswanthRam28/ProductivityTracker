import React from 'react';
import { House } from '../types';
import { StarkSigil, LannisterSigil, TargaryenSigil } from './Icons';

interface HouseSelectorProps {
  onSelectHouse: (house: House) => void;
}

const houses = [
  { id: House.STARK, name: "Stark", words: "Winter is Coming", color: "hover:border-blue-400 hover:text-blue-300", sigil: StarkSigil },
  { id: House.LANNISTER, name: "Lannister", words: "Hear Me Roar!", color: "hover:border-red-500 hover:text-red-400", sigil: LannisterSigil },
  { id: House.TARGARYEN, name: "Targaryen", words: "Fire and Blood", color: "hover:border-rose-500 hover:text-rose-400", sigil: TargaryenSigil },
];

const HouseSelector: React.FC<HouseSelectorProps> = ({ onSelectHouse }) => {
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-2xl text-center fade-in-up">
        <h1 className="text-4xl font-got text-amber-300 mb-4">Pledge Your Allegiance</h1>
        <p className="text-slate-400 mb-8">Choose a Great House to represent your scholarly pursuits.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {houses.map((house, index) => (
            <div
              key={house.id}
              onClick={() => onSelectHouse(house.id)}
              className={`bg-slate-800/50 p-6 rounded-lg border-2 border-slate-700 shadow-lg cursor-pointer transition-all duration-300 transform hover:-translate-y-2 ${house.color} fade-in-up`}
              style={{ animationDelay: `${200 * (index + 1)}ms` }}
            >
              <house.sigil className="w-20 h-20 mx-auto mb-4 text-slate-500 transition-colors" />
              <h3 className="font-got text-2xl text-slate-200">{house.name}</h3>
              <p className="text-sm text-slate-400 italic mt-1">"{house.words}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HouseSelector;