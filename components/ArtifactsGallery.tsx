import React, { useMemo } from 'react';
import { Artifact, UserProfile, ThemeColors, ThemeMode } from '../types';
import { CrownIcon } from './Icons';

interface ArtifactsGalleryProps {
    artifacts: Artifact[];
    userProfile: UserProfile;
    onRedeem: (artifact: Artifact) => void;
    theme: ThemeColors;
    themeMode: ThemeMode;
}

const rarityColors = {
    'Common': 'text-slate-300',
    'Rare': 'text-blue-400',
    'Legendary': 'text-yellow-400',
};

const ArtifactsGallery: React.FC<ArtifactsGalleryProps> = ({ artifacts, userProfile, onRedeem, theme, themeMode }) => {
    
    const sortedArtifacts = useMemo(() => {
        const rarityOrder = { 'Legendary': 3, 'Rare': 2, 'Common': 1 };
        return [...artifacts].sort((a, b) => {
            const aUnlocked = userProfile.unlockedArtifactIds.includes(a.id);
            const bUnlocked = userProfile.unlockedArtifactIds.includes(b.id);
            if (aUnlocked !== bUnlocked) return aUnlocked ? 1 : -1;
            
            const rarityA = a.rarity || 'Common';
            const rarityB = b.rarity || 'Common';
            if (rarityOrder[rarityA] !== rarityOrder[rarityB]) {
                return rarityOrder[rarityB] - rarityOrder[rarityA];
            }
            return a.cost - b.cost;
        });
    }, [artifacts, userProfile.unlockedArtifactIds]);

    return (
        <div className="card-bg p-6 rounded-lg border-main border shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h2 className={`font-got text-2xl ${theme.text}`}>The Treasury</h2>
                <div className="flex items-center gap-2 font-bold text-lg">
                    <CrownIcon className={`w-6 h-6 text-yellow-400`} />
                    <span className="text-main">{userProfile.tokens}</span>
                </div>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 max-h-[30rem] overflow-y-auto pr-2">
                {sortedArtifacts.map(artifact => {
                    const isUnlocked = userProfile.unlockedArtifactIds.includes(artifact.id);
                    const canAfford = userProfile.tokens >= artifact.cost;
                    const rarity = artifact.rarity || 'Common';
                    return (
                        <div key={artifact.id} className={`p-3 rounded-lg text-center transition-all ${themeMode === 'light' ? 'bg-slate-100' : 'bg-slate-900'} ${isUnlocked ? 'opacity-50' : ''}`} title={`${artifact.description} [${rarity}]`}>
                            <artifact.icon className={`w-12 h-12 mx-auto mb-2 ${isUnlocked ? theme.text : 'text-light'}`} />
                            <p className={`font-bold text-sm ${isUnlocked ? 'text-slate-500' : rarityColors[rarity]}`}>{artifact.name}</p>
                            {isUnlocked ? (
                                <p className="text-sm text-green-500 font-bold mt-1">Unlocked</p>
                            ) : (
                                <button
                                    onClick={() => onRedeem(artifact)}
                                    disabled={!canAfford}
                                    className={`w-full mt-1 text-xs font-bold py-1 px-2 rounded ${
                                        canAfford 
                                        ? `${theme.accent} ${theme.accentHover} text-white` 
                                        : `${themeMode === 'light' ? 'bg-slate-200' : 'bg-slate-700'} text-light cursor-not-allowed`
                                    }`}
                                >
                                    {artifact.cost} Tokens
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ArtifactsGallery;