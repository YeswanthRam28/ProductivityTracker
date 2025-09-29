import React from 'react';

export enum SessionStatus {
  PLANNED = 'PLANNED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
}

export interface StudySession {
  id: number;
  subject: string;
  topic: string;
  duration: number; // in minutes
  status: SessionStatus;
  completedAt?: string;
}

export enum House {
    STARK = 'Stark',
    LANNISTER = 'Lannister',
    TARGARYEN = 'Targaryen',
    UNSWORN = 'Unsworn',
}

export interface Goal {
    id: number;
    text: string;
    completed: boolean;
}

export interface ThemeColors {
    primary: string;
    text: string;
    border: string;
    accent: string;
    accentHover: string;
}

export type ThemeMode = 'dark' | 'light';

export interface UserProfile {
    tokens: number;
    streakFreezes: number;
    unlockedArtifactIds: number[];
}

export interface Artifact {
    id: number;
    name: string;
    description: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    cost: number;
    rarity?: 'Common' | 'Rare' | 'Legendary';
}

export interface Friend {
    id: string;
    name: string;
    house: House;
    studyMinutes: number;
    isUser?: boolean;
}