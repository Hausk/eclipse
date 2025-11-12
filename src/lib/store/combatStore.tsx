// lib/store/combatStore.ts
import { create } from 'zustand';
import { Monster } from '@/lib/game/entities/Monster';

interface CombatState {
  // État du combat
  isInCombat: boolean;
  currentEnemy: Monster | null;
  playerTurn: boolean;
  combatLog: string[];
  isDefending: boolean;
  
  // Stats joueur
  playerStats: {
    hp: number;
    maxHp: number;
    mp: number;
    maxMp: number;
    attack: number;
    defense: number;
    level: number;
  };
  
  // Actions
  startCombat: (enemy: Monster) => void;
  endCombat: () => void;
  playerAttack: () => void;
  playerDefend: () => void;
  playerFlee: () => boolean;
  enemyTurn: () => void;
  addLog: (message: string) => void;
  damagePlayer: (damage: number) => void;
  damageEnemy: (damage: number) => void;
}

export const useCombatStore = create<CombatState>((set, get) => ({
  // État initial
  isInCombat: false,
  currentEnemy: null,
  playerTurn: true,
  combatLog: [],
  isDefending: false,
  
  playerStats: {
    hp: 100,
    maxHp: 100,
    mp: 50,
    maxMp: 50,
    attack: 15,
    defense: 10,
    level: 1,
  },
  
  // Démarrer combat
  startCombat: (enemy) => {
    set({
      isInCombat: true,
      currentEnemy: enemy,
      playerTurn: true,
      combatLog: [`⚔️ Combat contre ${enemy.stats.name} !`],
      isDefending: false,
    });
  },
  
  // Terminer combat
  endCombat: () => {
    set({
      isInCombat: false,
      currentEnemy: null,
      playerTurn: true,
      combatLog: [],
      isDefending: false,
    });
  },
  
  // Attaque joueur
  playerAttack: () => {
    const state = get();
    if (!state.currentEnemy || !state.playerTurn) return;
    
    // Calcul dégâts
    const baseDamage = state.playerStats.attack;
    const variance = 0.8 + Math.random() * 0.4; // ±20%
    const isCritical = Math.random() < 0.15; // 15% crit
    const damage = Math.floor(baseDamage * variance * (isCritical ? 2 : 1));
    
    // Appliquer dégâts
    get().damageEnemy(damage);
    
    // Log
    const critText = isCritical ? ' CRITIQUE !' : '';
    get().addLog(`💥 Vous attaquez pour ${damage} dégâts${critText}`);
    
    // Check si monstre mort
    if (state.currentEnemy.stats.hp <= 0) {
      get().addLog(`✅ ${state.currentEnemy.stats.name} est vaincu !`);
      setTimeout(() => {
        get().endCombat();
      }, 2000);
      return;
    }
    
    // Tour de l'ennemi
    set({ playerTurn: false });
    setTimeout(() => {
      get().enemyTurn();
    }, 1500);
  },
  
  // Défense joueur
  playerDefend: () => {
    const state = get();
    if (!state.playerTurn) return;
    
    set({ isDefending: true });
    get().addLog('🛡️ Vous vous mettez en défense...');
    
    // Tour de l'ennemi
    set({ playerTurn: false });
    setTimeout(() => {
      get().enemyTurn();
    }, 1500);
  },
  
  // Fuite
  playerFlee: () => {
    const fleeChance = 0.5; // 50% de chance
    const success = Math.random() < fleeChance;
    
    if (success) {
      get().addLog('🏃 Vous avez fui le combat !');
      setTimeout(() => {
        get().endCombat();
      }, 1500);
      return true;
    } else {
      get().addLog('❌ Impossible de fuir !');
      set({ playerTurn: false });
      setTimeout(() => {
        get().enemyTurn();
      }, 1500);
      return false;
    }
  },
  
  // Tour ennemi
  enemyTurn: () => {
    const state = get();
    if (!state.currentEnemy) return;
    
    // Calcul dégâts ennemi
    const baseDamage = 10 + state.currentEnemy.stats.level * 2;
    const variance = 0.8 + Math.random() * 0.4;
    let damage = Math.floor(baseDamage * variance);
    
    // Si le joueur défend, réduit dégâts
    if (state.isDefending) {
      damage = Math.floor(damage * 0.5);
      get().addLog(`🛡️ Défense ! Dégâts réduits de 50%`);
    }
    
    // Appliquer dégâts au joueur
    get().damagePlayer(damage);
    get().addLog(`👹 ${state.currentEnemy.stats.name} attaque pour ${damage} dégâts`);
    
    // Check si joueur mort
    if (state.playerStats.hp <= 0) {
      get().addLog('💀 Vous êtes vaincu...');
      setTimeout(() => {
        // Reset HP et fin combat
        set((s) => ({
          playerStats: { ...s.playerStats, hp: s.playerStats.maxHp },
        }));
        get().endCombat();
      }, 2000);
      return;
    }
    
    // Retour au tour du joueur
    set({ playerTurn: true, isDefending: false });
  },
  
  // Ajouter log
  addLog: (message) => {
    set((state) => ({
      combatLog: [...state.combatLog.slice(-4), message], // Garder 5 messages max
    }));
  },
  
  // Infliger dégâts au joueur
  damagePlayer: (damage) => {
    set((state) => ({
      playerStats: {
        ...state.playerStats,
        hp: Math.max(0, state.playerStats.hp - damage),
      },
    }));
  },
  
  // Infliger dégâts à l'ennemi
  damageEnemy: (damage) => {
    set((state) => {
      if (!state.currentEnemy) return state;
      
      state.currentEnemy.stats.hp = Math.max(
        0,
        state.currentEnemy.stats.hp - damage
      );
      
      return { currentEnemy: state.currentEnemy };
    });
  },
}));