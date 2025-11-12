// lib/store/gameStore.ts
import { create } from 'zustand';

interface PlayerStats {
  level: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
}

interface MonsterInfo {
  name: string;
  level: number;
  distance: number;
}

interface GameState {
  playerStats: PlayerStats;
  nearbyMonsters: MonsterInfo[];
  
  updatePlayerStats: (stats: Partial<PlayerStats>) => void;
  updateNearbyMonsters: (monsters: MonsterInfo[]) => void;
}

export const useGameStore = create<GameState>((set) => ({
  playerStats: {
    level: 1,
    hp: 100,
    maxHp: 100,
    mp: 50,
    maxMp: 50,
  },
  
  nearbyMonsters: [],
  
  updatePlayerStats: (stats) => set((state) => ({
    playerStats: { ...state.playerStats, ...stats }
  })),
  
  updateNearbyMonsters: (monsters) => set({ nearbyMonsters: monsters }),
}));