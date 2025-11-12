// types/combat.ts
import { Monster } from '@/lib/game/entities/Monster';

export interface CombatState {
  isInCombat: boolean;
  currentEnemy: Monster | null;
  playerTurn: boolean;
  combatLog: string[];
  playerStats: {
    hp: number;
    maxHp: number;
    mp: number;
    maxMp: number;
    attack: number;
    defense: number;
    level: number;
  };
}

export type CombatAction = 'attack' | 'defend' | 'flee';

export interface CombatResult {
  damage: number;
  isCritical: boolean;
  message: string;
}