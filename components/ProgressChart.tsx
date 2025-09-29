import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { StudySession, ThemeColors, ThemeMode } from '../types';
import { BarChartIcon } from './Icons';

interface ProgressChartProps {
  sessions: StudySession[];
  theme: ThemeColors;
  themeMode: ThemeMode;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ sessions, theme, themeMode }) => {
  const chartData = useMemo(() => {
    const subjectTimes: { [key: string]: number } = {};
    sessions.forEach(session => {
      subjectTimes[session.subject] = (subjectTimes[session.subject] || 0) + session.duration;
    });
    return Object.keys(subjectTimes).map(subject => ({
      name: subject,
      minutes: subjectTimes[subject],
    }));
  }, [sessions]);

  const tickColor = themeMode === 'light' ? '#4b5563' : '#94a3b8';
  const gridColor = themeMode === 'light' ? '#e5e7eb' : '#475569';
  const tooltipBg = themeMode === 'light' ? '#ffffff' : '#1e293b';
  const tooltipBorder = themeMode === 'light' ? '#d1d5db' : '#334155';

  if (sessions.length === 0) {
    return (
       <div className="card-bg p-6 rounded-lg border-main border shadow-lg text-center">
         <h2 className={`font-got text-2xl ${theme.text} mb-4 flex items-center justify-center gap-3`}>
           <BarChartIcon className="w-6 h-6"/>
           Map of Conquered Realms
         </h2>
         <p className="text-light">Your map is yet to be drawn. Conquer a realm to begin your cartography.</p>
       </div>
    )
  }

  return (
    <div className="card-bg p-6 rounded-lg border-main border shadow-lg">
      <h2 className={`font-got text-2xl ${theme.text} mb-6 text-center flex items-center justify-center gap-3`}>
        <BarChartIcon className="w-6 h-6"/>
        Map of Conquered Realms
      </h2>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="name" tick={{ fill: tickColor }} stroke={gridColor} />
            <YAxis tick={{ fill: tickColor }} stroke={gridColor} label={{ value: 'Minutes', angle: -90, position: 'insideLeft', fill: tickColor }} />
            <Tooltip
                contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}` }}
                labelFormatter={(label) => <span style={{ color: theme.primary }}>{label}</span>}
                cursor={{fill: theme.primary + '1A' }}
            />
            <Bar dataKey="minutes" fill={theme.primary} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProgressChart;