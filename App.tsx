import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { StudySession, SessionStatus, House, Goal, ThemeColors, UserProfile, Artifact, Friend, ThemeMode } from './types';
import Header from './components/Header';
import StudySessionForm from './components/StudySessionForm';
import StudySessionList from './components/StudySessionList';
import PomodoroModal from './components/TimerModal';
import ProgressChart from './components/ProgressChart';
import StreaksAndGoals from './components/StreaksAndGoals';
import HouseSelector from './components/HouseSelector';
import Leaderboard from './components/Leaderboard';
import ArtifactsGallery from './components/ArtifactsGallery';
import WeeklyReportModal from './components/WeeklyReportModal';
import TimetableImporterModal from './components/TimetableImporterModal';
import { 
    DragonIcon, ValyrianSteelIcon, DragonEggIcon, WeirwoodLeafIcon, StarkSigil, LannisterSigil, TargaryenSigil, 
    BaratheonSigil, GreyjoySigil, TyrellSigil, MartellSigil, ArrynSigil, SwordIcon, DaggerIcon, DoorIcon, IronThroneIcon, 
    CoinIcon, PotionIcon, PinIcon, RavenIcon, CrownIcon, MapIcon 
} from './components/Icons';

const houseThemes: Record<House, ThemeColors> = {
  [House.UNSWORN]: { primary: '#f59e0b', text: 'text-amber-300', border: 'border-amber-400', accent: 'bg-amber-600', accentHover: 'hover:bg-amber-500' },
  [House.STARK]: { primary: '#60a5fa', text: 'text-blue-300', border: 'border-blue-400', accent: 'bg-blue-600', accentHover: 'hover:bg-blue-500' },
  [House.LANNISTER]: { primary: '#10b981', text: 'text-emerald-300', border: 'border-emerald-400', accent: 'bg-emerald-600', accentHover: 'hover:bg-emerald-500' },
  [House.TARGARYEN]: { primary: '#f43f5e', text: 'text-rose-400', border: 'border-rose-500', accent: 'bg-rose-700', accentHover: 'hover:bg-rose-600' },
};

const lightTheme: ThemeColors = { primary: '#3b82f6', text: 'text-blue-600', border: 'border-blue-500', accent: 'bg-blue-600', accentHover: 'hover:bg-blue-500' };

// Mock Data
const initialArtifacts: Artifact[] = [
    // Common
    { id: 101, name: 'Stark Sigil', description: 'The emblem of the Direwolf.', icon: StarkSigil, cost: 30, rarity: 'Common' },
    { id: 102, name: 'Lannister Sigil', description: 'The emblem of the Lion.', icon: LannisterSigil, cost: 30, rarity: 'Common' },
    { id: 103, name: 'Targaryen Sigil', description: 'The emblem of the Three-Headed Dragon.', icon: TargaryenSigil, cost: 30, rarity: 'Common' },
    { id: 104, name: 'Baratheon Sigil', description: 'The emblem of the Stag.', icon: BaratheonSigil, cost: 30, rarity: 'Common' },
    { id: 105, name: 'Raven Scroll', description: 'A message from a distant rookery.', icon: RavenIcon, cost: 25, rarity: 'Common' },
    { id: 106, name: 'Greyjoy Sigil', description: 'The emblem of the Kraken.', icon: GreyjoySigil, cost: 30, rarity: 'Common' },
    { id: 107, name: 'Tyrell Sigil', description: 'The emblem of the Rose.', icon: TyrellSigil, cost: 30, rarity: 'Common' },
    { id: 108, name: 'Martell Sigil', description: 'The emblem of the Sun Spear.', icon: MartellSigil, cost: 30, rarity: 'Common' },
    { id: 109, name: 'Arryn Sigil', description: 'The emblem of the Falcon.', icon: ArrynSigil, cost: 30, rarity: 'Common' },
    
    // Rare
    { id: 2, name: 'Dragon Egg', description: 'A petrified egg, warm to the touch.', icon: DragonEggIcon, cost: 250, rarity: 'Rare' },
    { id: 3, name: 'Weirwood Leaf', description: 'A red leaf from a sacred tree.', icon: WeirwoodLeafIcon, cost: 120, rarity: 'Rare' },
    { id: 201, name: 'Dragonglass Dagger', description: 'One of the few things that can stop Them.', icon: DaggerIcon, cost: 200, rarity: 'Rare' },
    { id: 202, name: 'Faceless Coin', description: 'Valar Morghulis.', icon: CoinIcon, cost: 180, rarity: 'Rare' },
    { id: 203, name: 'Hand of the King Pin', description: 'A symbol of power and peril.', icon: PinIcon, cost: 150, rarity: 'Rare' },
    { id: 204, name: 'Wildfire Vial', description: 'Handle with extreme care.', icon: PotionIcon, cost: 160, rarity: 'Rare' },
    { id: 205, name: 'Map of Westeros', description: 'Plan your conquests.', icon: MapIcon, cost: 100, rarity: 'Rare' },
    
    // Legendary
    { id: 1, name: 'Valyrian Steel', description: 'A blade of legendary sharpness.', icon: ValyrianSteelIcon, cost: 500, rarity: 'Legendary' },
    { id: 301, name: 'Needle', description: "Arya's trusty sword.", icon: SwordIcon, cost: 450, rarity: 'Legendary' },
    { id: 302, name: 'Hodor\'s Door', description: 'Hold the door!', icon: DoorIcon, cost: 400, rarity: 'Legendary' },
    { id: 303, name: 'Crown of the King', description: 'Heavy is the head that wears the crown.', icon: CrownIcon, cost: 600, rarity: 'Legendary' },
    { id: 304, name: 'Iron Throne', description: 'The seat of the ruler of the Seven Kingdoms.', icon: IronThroneIcon, cost: 1000, rarity: 'Legendary' },
];

const initialFriends: Friend[] = [
    { id: 'user', name: 'You', house: House.STARK, studyMinutes: 0, isUser: true },
    { id: '1', name: 'Jon Snow', house: House.STARK, studyMinutes: 1250 },
    { id: '2', name: 'Daenerys', house: House.TARGARYEN, studyMinutes: 2400 },
    { id: '3', name: 'Tyrion', house: House.LANNISTER, studyMinutes: 3100 },
    { id: '4', name: 'Arya Stark', house: House.STARK, studyMinutes: 1800 },
];


const calculateStreak = (completedSessions: StudySession[]): number => {
    if (completedSessions.length === 0) return 0;
    const sortedSessions = completedSessions.filter(s => s.completedAt).sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime());
    const uniqueDays = [...new Set(sortedSessions.map(s => new Date(s.completedAt!).toDateString()))];
    if (uniqueDays.length === 0) return 0;
    let streak = 0;
    const today = new Date();
    let yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const firstDay = new Date(uniqueDays[0]);
    if (firstDay.toDateString() !== today.toDateString() && firstDay.toDateString() !== yesterday.toDateString()) return 0;
    streak = 1;
    let lastDate = new Date(uniqueDays[0]);
    for (let i = 1; i < uniqueDays.length; i++) {
        const currentDate = new Date(uniqueDays[i]);
        const expectedPrevDate = new Date(lastDate);
        expectedPrevDate.setDate(lastDate.getDate() - 1);
        if (currentDate.toDateString() === expectedPrevDate.toDateString()) {
            streak++;
            lastDate = currentDate;
        } else {
            break;
        }
    }
    return streak;
};


const App: React.FC = () => {
  const [sessions, setSessions] = useState<StudySession[]>(() => JSON.parse(localStorage.getItem('studySessions') || '[]'));
  const [goals, setGoals] = useState<Goal[]>(() => JSON.parse(localStorage.getItem('studyGoals') || '[]'));
  const [house, setHouse] = useState<House>(() => (localStorage.getItem('userHouse') as House) || House.UNSWORN);
  const [userProfile, setUserProfile] = useState<UserProfile>(() => JSON.parse(localStorage.getItem('userProfile') || '{"tokens": 0, "streakFreezes": 2, "unlockedArtifactIds": []}'));
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => (localStorage.getItem('themeMode') as ThemeMode) || 'dark');
  const [activeSession, setActiveSession] = useState<StudySession | null>(null);
  const [friends, setFriends] = useState<Friend[]>(initialFriends);
  const [showReport, setShowReport] = useState(false);
  const [showImporter, setShowImporter] = useState(false);

  useEffect(() => { localStorage.setItem('studySessions', JSON.stringify(sessions)) }, [sessions]);
  useEffect(() => { localStorage.setItem('studyGoals', JSON.stringify(goals)) }, [goals]);
  useEffect(() => { localStorage.setItem('userHouse', house) }, [house]);
  useEffect(() => { localStorage.setItem('userProfile', JSON.stringify(userProfile)) }, [userProfile]);
  useEffect(() => {
    localStorage.setItem('themeMode', themeMode);
    document.documentElement.className = themeMode === 'light' ? 'light' : '';
  }, [themeMode]);

  const theme = themeMode === 'light' ? lightTheme : (houseThemes[house] || houseThemes[House.UNSWORN]);

  const addSession = (session: Omit<StudySession, 'id' | 'status'>) => {
    setSessions(prev => [{ ...session, id: Date.now(), status: SessionStatus.PLANNED }, ...prev]);
  };

  const addMultipleSessions = useCallback((newSessions: Omit<StudySession, 'id' | 'status'>[]) => {
      const sessionsToAdd = newSessions.map((s, index) => ({
          ...s,
          id: Date.now() + index,
          status: SessionStatus.PLANNED
      }));
      setSessions(prev => [...sessionsToAdd, ...prev]);
  }, []);
  
  const updateSessionOrder = useCallback((reorderedSessions: StudySession[]) => {
      const completed = sessions.filter(s => s.status === SessionStatus.COMPLETED);
      setSessions([...reorderedSessions, ...completed]);
  }, [sessions]);

  const updateSessionStatus = (id: number, status: SessionStatus) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, status, completedAt: status === SessionStatus.COMPLETED ? new Date().toISOString() : s.completedAt } : s));
    if (status !== SessionStatus.ACTIVE) setActiveSession(null);
  };
  
  const handleSessionComplete = (id: number, minutesStudied: number) => {
      const tokensEarned = Math.floor(minutesStudied / 5); // 1 token per 5 mins
      setUserProfile(prev => ({ ...prev, tokens: prev.tokens + tokensEarned }));
      updateSessionStatus(id, SessionStatus.COMPLETED);
  };
  
  const handleSessionFail = (id: number, minutesStudied: number) => {
      const tokensEarned = Math.floor(minutesStudied / 10); // Penalty for failing
      setUserProfile(prev => ({ ...prev, tokens: prev.tokens + tokensEarned }));
      updateSessionStatus(id, SessionStatus.PLANNED);
  };

  const deleteSession = (id: number) => setSessions(prev => prev.filter(s => s.id !== id));
  const startSession = (session: StudySession) => {
    setActiveSession(session);
    updateSessionStatus(session.id, SessionStatus.ACTIVE);
  };
  
  const redeemArtifact = (artifact: Artifact) => {
      if (userProfile.tokens >= artifact.cost && !userProfile.unlockedArtifactIds.includes(artifact.id)) {
          setUserProfile(prev => ({
              ...prev,
              tokens: prev.tokens - artifact.cost,
              unlockedArtifactIds: [...prev.unlockedArtifactIds, artifact.id]
          }));
      }
  };

  const activeSessions = useMemo(() => sessions.filter(s => s.status !== SessionStatus.COMPLETED), [sessions]);
  const completedSessions = useMemo(() => sessions.filter(s => s.status === SessionStatus.COMPLETED), [sessions]);
  const streak = useMemo(() => calculateStreak(completedSessions), [completedSessions]);
  
  useEffect(() => {
    const totalMinutes = completedSessions.reduce((sum, s) => sum + s.duration, 0);
    setFriends(f => f.map(friend => friend.isUser ? { ...friend, studyMinutes: totalMinutes, house } : friend))
  }, [completedSessions, house]);

  const addGoal = (text: string) => setGoals(prev => [...prev, { id: Date.now(), text, completed: false }]);
  const toggleGoal = (id: number) => setGoals(prev => prev.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
  const deleteGoal = (id: number) => setGoals(prev => prev.filter(g => g.id !== id));

  return (
    <div className={`min-h-screen main-bg p-4 sm:p-6 lg:p-8`}>
      <div className="container mx-auto max-w-screen-2xl">
        <Header house={house} onSigilClick={() => setHouse(House.UNSWORN)} theme={theme} themeMode={themeMode} setThemeMode={setThemeMode} onOpenReport={() => setShowReport(true)} />

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
          {/* Left Column */}
          <div className="lg:col-span-3 flex flex-col gap-8">
            <div className="fade-in-up" style={{ animationDelay: '100ms' }}>
              <StudySessionForm onAddSession={addSession} theme={theme} themeMode={themeMode} />
            </div>
            <div className="fade-in-up" style={{ animationDelay: '200ms' }}>
              <StreaksAndGoals streak={streak} goals={goals} onAddGoal={addGoal} onToggleGoal={toggleGoal} onDeleteGoal={deleteGoal} theme={theme} themeMode={themeMode} userProfile={userProfile} />
            </div>
            <div className="fade-in-up" style={{ animationDelay: '300ms' }}>
              <ProgressChart sessions={completedSessions} theme={theme} themeMode={themeMode} />
            </div>
             <div className="fade-in-up card-bg border-main border p-6 rounded-lg shadow-lg text-center" style={{ animationDelay: '400ms' }}>
                <h2 className={`font-got text-2xl ${theme.text} mb-4`}>Kingdom's Edicts</h2>
                <button onClick={() => setShowImporter(true)} className={`w-full ${theme.accent} ${theme.accentHover} text-white font-bold py-2 px-4 rounded-md transition-transform transform hover:scale-105`}>Import Timetable</button>
            </div>
          </div>

          {/* Middle Column */}
          <div className="lg:col-span-5">
            {sessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full card-bg border-main border p-12 text-center shadow-lg fade-in-up" style={{ animationDelay: '400ms' }}>
                    <DragonIcon className={`w-24 h-24 ${theme.text} mb-4`} />
                    <h2 className={`font-got text-2xl ${theme.text}`}>The Realm is Quiet...</h2>
                    <p className="text-light">Your chronicles are empty. Declare a new campaign to begin your conquest of knowledge.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-8">
                    <div className="fade-in-up" style={{ animationDelay: '500ms' }}>
                        <StudySessionList title="Active Campaigns" sessions={activeSessions} onStart={startSession} onDelete={deleteSession} onComplete={(id) => handleSessionComplete(id, sessions.find(s=>s.id===id)?.duration || 0)} theme={theme} themeMode={themeMode} onUpdateOrder={updateSessionOrder}/>
                    </div>
                    <div className="fade-in-up" style={{ animationDelay: '600ms' }}>
                        <StudySessionList title="Conquered Realms" sessions={completedSessions} onStart={startSession} onDelete={deleteSession} onComplete={(id) => handleSessionComplete(id, 0)} theme={theme} themeMode={themeMode} onUpdateOrder={() => {}} />
                    </div>
                </div>
            )}
          </div>
          
          {/* Right Column */}
          <div className="lg:col-span-4 flex flex-col gap-8">
             <div className="fade-in-up" style={{ animationDelay: '700ms' }}>
                <Leaderboard friends={friends} theme={theme} themeMode={themeMode} />
            </div>
            <div className="fade-in-up" style={{ animationDelay: '800ms' }}>
                <ArtifactsGallery artifacts={initialArtifacts} userProfile={userProfile} onRedeem={redeemArtifact} theme={theme} themeMode={themeMode} />
            </div>
          </div>
        </main>
      </div>

      {house === House.UNSWORN && <HouseSelector onSelectHouse={setHouse} />}

      {activeSession && (
        <PomodoroModal session={activeSession} onClose={() => updateSessionStatus(activeSession.id, SessionStatus.PLANNED)} onComplete={handleSessionComplete} onFail={handleSessionFail} theme={theme} themeMode={themeMode} />
      )}
      
      {showReport && <WeeklyReportModal onClose={() => setShowReport(false)} sessions={completedSessions} theme={theme} themeMode={themeMode} />}

      {showImporter && (
          <TimetableImporterModal 
              onClose={() => setShowImporter(false)}
              onImport={addMultipleSessions}
              theme={theme}
              themeMode={themeMode}
          />
      )}
    </div>
  );
};

export default App;