// lib/store/combatStore.ts
import { create } from 'zustand';

interface Stats {
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  level: number;
  attack: number;
  defense: number;
  speed: number;
  name: string;
}

interface Enemy {
  id: string;
  stats: Stats;
}

interface CombatState {
  isInCombat: boolean;
  currentEnemy: Enemy | null;
  playerTurn: boolean;
  combatLog: string[];
  playerStats: Stats;
  
  // Actions
  startCombat: (enemy: Enemy) => void;
  endCombat: (victory: boolean) => void;
  checkCombatEnd: () => boolean;
  playerAttack: () => void;
  playerDefend: () => void;
  playerFlee: () => void;
  enemyTurn: () => void;
  addLog: (message: string) => void;
}

export const useCombatStore = create<CombatState>((set, get) => ({
  isInCombat: false,
  currentEnemy: null,
  playerTurn: true,
  combatLog: [],
  playerStats: {
    name: 'Hauskiel',
    hp: 100,
    maxHp: 100,
    mp: 50,
    maxMp: 50,
    level: 1,
    attack: 15,      // ⚔️ Dégâts de base
    defense: 8,      // 🛡️ Défense de base
    speed: 100,      // ⚡ Vitesse (pour l'ordre des tours)
  },

  addLog: (message: string) => {
    set((state) => ({
      combatLog: [...state.combatLog.slice(-9), message], // Garde les 10 derniers messages
    }));
  },

  startCombat: (enemy: Enemy) => {
    console.log('⚔️ Combat démarré contre', enemy.stats.name);
    set({
      isInCombat: true,
      currentEnemy: enemy,
      playerTurn: true,
      combatLog: [`Combat contre ${enemy.stats.name} !`],
    });
  },

  endCombat: (victory: boolean) => {
    const { addLog } = get();
    
    if (victory) {
      addLog('🎉 Victoire !');
      console.log('✅ Victoire !');
      
      // TODO: Récompenses (XP, loot, etc.)
    } else {
      addLog('💀 Défaite...');
      console.log('❌ Défaite');
    }

    // Réinitialiser l'état de combat après 2 secondes
    setTimeout(() => {
      set({
        isInCombat: false,
        currentEnemy: null,
        playerTurn: true,
        combatLog: [],
      });
    }, 2000);
  },

  // Vérifier si le combat doit se terminer
  checkCombatEnd: () => {
    const { playerStats, currentEnemy, endCombat } = get();

    // CRITIQUE : Vérifier la mort de l'ennemi
    if (currentEnemy && currentEnemy.stats.hp <= 0) {
      console.log('💀 Ennemi vaincu !');
      endCombat(true);
      return true;
    }

    // Vérifier la mort du joueur
    if (playerStats.hp <= 0) {
      console.log('💀 Joueur vaincu !');
      endCombat(false);
      return true;
    }

    return false;
  },

  playerAttack: () => {
    const { playerStats, currentEnemy, playerTurn, addLog, checkCombatEnd, enemyTurn } = get();
    
    if (!playerTurn || !currentEnemy) return;

    console.log('⚔️ Attaque du joueur');
    
    // Calculer les dégâts
    const baseDamage = playerStats.attack;
    const damageVariation = Math.floor(Math.random() * 5) - 2; // -2 à +2
    const totalDamage = Math.max(1, baseDamage + damageVariation - Math.floor(currentEnemy.stats.defense / 2));

    // Appliquer les dégâts
    const newEnemyHp = Math.max(0, currentEnemy.stats.hp - totalDamage);
    
    set((state) => ({
      currentEnemy: state.currentEnemy ? {
        ...state.currentEnemy,
        stats: {
          ...state.currentEnemy.stats,
          hp: newEnemyHp,
        },
      } : null,
      playerTurn: false,
    }));

    addLog(`Vous infligez ${totalDamage} dégâts !`);

    // CRITIQUE : Vérifier si l'ennemi est mort APRÈS avoir mis à jour son HP
    setTimeout(() => {
      if (!checkCombatEnd()) {
        // Si le combat continue, tour de l'ennemi
        enemyTurn();
      }
    }, 500);
  },

  playerDefend: () => {
    const { playerTurn, addLog, enemyTurn, checkCombatEnd } = get();
    
    if (!playerTurn) return;

    console.log('🛡️ Défense du joueur');
    
    set({ playerTurn: false });
    addLog('Vous vous préparez à défendre !');

    // TODO: Ajouter un buff de défense temporaire
    
    setTimeout(() => {
      if (!checkCombatEnd()) {
        enemyTurn();
      }
    }, 500);
  },

  playerFlee: () => {
    const { playerTurn, addLog, endCombat } = get();
    
    if (!playerTurn) return;

    console.log('🏃 Tentative de fuite');
    
    // 50% de chance de réussir
    const fleeSuccess = Math.random() > 0.5;

    if (fleeSuccess) {
      addLog('Vous prenez la fuite !');
      endCombat(false);
    } else {
      addLog('La fuite a échoué !');
      set({ playerTurn: false });
      
      setTimeout(() => {
        get().enemyTurn();
      }, 500);
    }
  },

  enemyTurn: () => {
    const { currentEnemy, playerStats, addLog, checkCombatEnd } = get();
    
    if (!currentEnemy) return;

    console.log('👹 Tour de l\'ennemi');
    
    // Calculer les dégâts de l'ennemi
    const baseDamage = currentEnemy.stats.attack;
    const damageVariation = Math.floor(Math.random() * 5) - 2;
    const totalDamage = Math.max(1, baseDamage + damageVariation - Math.floor(playerStats.defense / 2));

    // Appliquer les dégâts au joueur
    const newPlayerHp = Math.max(0, playerStats.hp - totalDamage);
    
    set((state) => ({
      playerStats: {
        ...state.playerStats,
        hp: newPlayerHp,
      },
      playerTurn: true,
    }));

    addLog(`${currentEnemy.stats.name} vous inflige ${totalDamage} dégâts !`);

    // Vérifier si le joueur est mort
    setTimeout(() => {
      checkCombatEnd();
    }, 500);
  },
}));