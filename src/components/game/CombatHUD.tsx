// components/game/CombatHUD.tsx
'use client';

import { useCombatStore } from '@/lib/store/combatStore';

// Barre de vie au-dessus de la tête des ennemis
export function EnemyHealthBar({ enemy, position }: { enemy: any; position: { x: number; y: number } }) {
  const hpPercent = (enemy.stats.hp / enemy.stats.maxHp) * 100;
  
  return (
    <div 
      className="pointer-events-none fixed z-40"
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y - 60}px`,
        transform: 'translateX(-50%)'
      }}
    >
      <div className="rounded-lg border-2 border-red-700 bg-black/80 p-2 backdrop-blur-sm">
        <div className="mb-1 text-center text-xs font-bold text-red-300">
          {enemy.stats.name}
        </div>
        <div className="h-2 w-32 overflow-hidden rounded-full border border-red-600 bg-stone-900">
          <div
            className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-300"
            style={{ width: `${hpPercent}%` }}
          />
        </div>
        <div className="mt-0.5 text-center text-[10px] text-white">
          {enemy.stats.hp} / {enemy.stats.maxHp}
        </div>
      </div>
    </div>
  );
}

// Stats du joueur et alliés (en haut à gauche style WoW)
export function PlayerPartyStats() {
  const pseudo = "Hauskiel";
  const playerStats = useCombatStore((state) => state.playerStats);
  
  const playerHpPercent = (playerStats.hp / playerStats.maxHp) * 100;
  const playerMpPercent = (playerStats.mp / playerStats.maxMp) * 100;

  return (
    <div className="pointer-events-none fixed left-4 top-4 z-50">
      <div className="pointer-events-auto w-64 space-y-2">
        {/* Joueur */}
        <div className="rounded-lg border-2 border-green-700 bg-black/80 p-3 backdrop-blur-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-bold text-green-300">
              {pseudo}
            </span>
            <span className="text-xs text-gray-400">
              Niv.{playerStats.level}
            </span>
          </div>
          
          {/* HP */}
          <div className="mb-1.5">
            <div className="h-3 w-full overflow-hidden rounded-full border border-green-600 bg-stone-900">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-300"
                style={{ width: `${playerHpPercent}%` }}
              />
            </div>
            <div className="mt-0.5 text-right text-[10px] text-white">
              {playerStats.hp} / {playerStats.maxHp}
            </div>
          </div>

          {/* MP */}
          <div>
            <div className="h-2 w-full overflow-hidden rounded-full border border-blue-600 bg-stone-900">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                style={{ width: `${playerMpPercent}%` }}
              />
            </div>
            <div className="mt-0.5 text-right text-[10px] text-blue-200">
              {playerStats.mp} / {playerStats.maxMp}
            </div>
          </div>
        </div>

        {/* TODO: Alliés à ajouter ici */}
      </div>
    </div>
  );
}

// Compteur de tour (ordre d'attaque basé sur la speed)
export function TurnOrderDisplay() {
  const playerStats = useCombatStore((state) => state.playerStats);
  const currentEnemy = useCombatStore((state) => state.currentEnemy);
  const playerTurn = useCombatStore((state) => state.playerTurn);

  // TODO: Plus tard, calculer l'ordre complet basé sur la speed de tous les combattants
  const turnOrder = [
    { name: "Hauskiel", speed: playerStats.speed || 100, isPlayer: true, isCurrent: playerTurn },
    { name: currentEnemy?.stats.name || "Ennemi", speed: currentEnemy?.stats.speed || 80, isPlayer: false, isCurrent: !playerTurn }
  ].sort((a, b) => b.speed - a.speed);

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50">
      <div className="pointer-events-auto rounded-lg border-2 border-amber-700 bg-black/80 p-3 backdrop-blur-sm">
        <div className="mb-2 text-center text-xs font-bold text-amber-300">
          Ordre de Tour
        </div>
        <div className="space-y-1.5">
          {turnOrder.map((entity, index) => (
            <div
              key={index}
              className={`flex items-center justify-between rounded px-2 py-1 text-xs ${
                entity.isCurrent
                  ? 'border-2 border-yellow-400 bg-yellow-900/40'
                  : 'border border-gray-600 bg-gray-900/40'
              }`}
            >
              <span className={entity.isPlayer ? 'text-green-300' : 'text-red-300'}>
                {entity.name}
              </span>
              <span className="text-gray-400 text-[10px]">
                ⚡{entity.speed}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Log de combat (centre en haut)
export function CombatLog() {
  const combatLog = useCombatStore((state) => state.combatLog);

  return (
    <div className="pointer-events-none fixed left-1/2 top-4 z-40 w-full max-w-md -translate-x-1/2">
      <div className="pointer-events-auto rounded-lg border-2 border-amber-700 bg-black/80 p-3 backdrop-blur-sm">
        <div className="max-h-24 space-y-0.5 overflow-y-auto">
          {combatLog.length === 0 && (
            <div className="text-xs text-amber-100/60">Combat en cours...</div>
          )}
          {combatLog.slice(-4).map((log, index) => (
            <div
              key={`${index}-${log}`}
              className="animate-fade-in text-xs text-amber-100"
            >
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Barre d'actions (en bas au centre)
export function ActionBar() {
  const playerTurn = useCombatStore((state) => state.playerTurn);
  const playerAttack = useCombatStore((state) => state.playerAttack);
  const playerDefend = useCombatStore((state) => state.playerDefend);
  const playerFlee = useCombatStore((state) => state.playerFlee);

  return (
    <div className="pointer-events-none fixed bottom-8 left-1/2 z-50 -translate-x-1/2">
      <div className="pointer-events-auto rounded-lg border-2 border-amber-700 bg-black/90 p-4 backdrop-blur-sm">
        <div className="mb-2 text-center text-xs font-bold text-amber-300">
          {playerTurn ? '⚔️ Votre Tour' : '⏳ Tour Ennemi...'}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              console.log('🎯 Attaque !');
              playerAttack();
            }}
            disabled={!playerTurn}
            className="rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-6 py-2 text-sm font-bold text-white shadow-lg transition hover:from-red-500 hover:to-red-600 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
          >
            ⚔️ Attaquer
          </button>

          <button
            onClick={() => {
              console.log('🛡️ Défense !');
              playerDefend();
            }}
            disabled={!playerTurn}
            className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-2 text-sm font-bold text-white shadow-lg transition hover:from-blue-500 hover:to-blue-600 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
          >
            🛡️ Défendre
          </button>

          <button
            onClick={() => {
              console.log('🏃 Fuite !');
              playerFlee();
            }}
            disabled={!playerTurn}
            className="rounded-lg bg-gradient-to-r from-gray-600 to-gray-700 px-6 py-2 text-sm font-bold text-white shadow-lg transition hover:from-gray-500 hover:to-gray-600 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
          >
            🏃 Fuir
          </button>
        </div>
      </div>
    </div>
  );
}

// Composant principal qui assemble tout
export function CombatHUD() {
  const isInCombat = useCombatStore((state) => state.isInCombat);
  const currentEnemy = useCombatStore((state) => state.currentEnemy);

  console.log('🎨 CombatHUD render - isInCombat:', isInCombat, 'enemy:', currentEnemy?.stats.name);

  if (!isInCombat || !currentEnemy) {
    return null;
  }

  return (
    <>
      {/* Fond semi-transparent */}
      <div className="pointer-events-none fixed inset-0 z-30 bg-black/40 backdrop-blur-[2px]" />
      
      {/* Stats joueur/alliés (haut gauche) */}
      <PlayerPartyStats />
      
      {/* Ordre des tours (haut droite) */}
      <TurnOrderDisplay />
      
      {/* Log de combat (centre haut) */}
      <CombatLog />
      
      {/* Barre d'actions (bas centre) */}
      <ActionBar />
      
      {/* Barres de vie ennemis (au-dessus de leur tête) */}
      {/* TODO: Position dynamique basée sur la position réelle de l'ennemi dans le canvas */}
      <EnemyHealthBar 
        enemy={currentEnemy} 
        position={{ x: window.innerWidth / 2, y: window.innerHeight / 3 }} 
      />
    </>
  );
}