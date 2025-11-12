// components/game/CombatHUD.tsx
'use client';

import { useCombatStore } from '@/lib/store/combatStore';

export function CombatHUD() {
  // Forcer la subscription à tous les états
  const isInCombat = useCombatStore((state) => state.isInCombat);
  const currentEnemy = useCombatStore((state) => state.currentEnemy);
  const playerTurn = useCombatStore((state) => state.playerTurn);
  const combatLog = useCombatStore((state) => state.combatLog);
  const playerStats = useCombatStore((state) => state.playerStats);
  const playerAttack = useCombatStore((state) => state.playerAttack);
  const playerDefend = useCombatStore((state) => state.playerDefend);
  const playerFlee = useCombatStore((state) => state.playerFlee);

  console.log('🎨 CombatHUD render - isInCombat:', isInCombat, 'enemy:', currentEnemy?.stats.name);

  if (!isInCombat || !currentEnemy) {
    return null;
  }

  const playerHpPercent = (playerStats.hp / playerStats.maxHp) * 100;
  const enemyHpPercent = (currentEnemy.stats.hp / currentEnemy.stats.maxHp) * 100;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="pointer-events-auto w-full max-w-4xl p-4">
        {/* Ennemi */}
        <div className="mb-8 flex justify-center">
          <div className="rounded-lg border-4 border-red-700 bg-gradient-to-br from-red-950/95 to-stone-950/95 p-6 shadow-2xl">
            <div className="mb-3 text-center text-2xl font-bold text-red-300">
              {currentEnemy.stats.name}
            </div>
            <div className="mb-2 text-center text-sm text-gray-400">
              Niveau {currentEnemy.stats.level}
            </div>
            
            {/* HP Ennemi */}
            <div className="mb-2">
              <div className="mb-1 text-xs text-red-200">HP</div>
              <div className="h-4 w-64 overflow-hidden rounded-full border-2 border-red-600 bg-stone-900">
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-300"
                  style={{ width: `${enemyHpPercent}%` }}
                />
              </div>
              <div className="mt-1 text-right text-xs text-white">
                {currentEnemy.stats.hp} / {currentEnemy.stats.maxHp}
              </div>
            </div>
          </div>
        </div>

        {/* Log de combat */}
        <div className="mb-6 rounded-lg border-2 border-amber-700 bg-gradient-to-br from-stone-900/95 to-stone-950/95 p-4 shadow-xl">
          <div className="space-y-1">
            {combatLog.length === 0 && (
              <div className="text-sm text-amber-100">En attente...</div>
            )}
            {combatLog.map((log, index) => (
              <div
                key={`${index}-${log}`}
                className="animate-fade-in text-sm text-amber-100"
              >
                {log}
              </div>
            ))}
          </div>
        </div>

        {/* Stats Joueur + Actions */}
        <div className="flex flex-col gap-4 md:flex-row">
          {/* Stats Joueur */}
          <div className="flex-1 rounded-lg border-4 border-green-700 bg-gradient-to-br from-green-950/95 to-stone-950/95 p-4 shadow-2xl">
            <div className="mb-3 text-lg font-bold text-green-300">
              Vous (Niv.{playerStats.level})
            </div>
            
            {/* HP */}
            <div className="mb-3">
              <div className="mb-1 text-xs text-green-200">HP</div>
              <div className="h-3 w-full overflow-hidden rounded-full border border-green-600 bg-stone-900">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-300"
                  style={{ width: `${playerHpPercent}%` }}
                />
              </div>
              <div className="mt-1 text-right text-xs text-white">
                {playerStats.hp} / {playerStats.maxHp}
              </div>
            </div>

            {/* MP */}
            <div>
              <div className="mb-1 text-xs text-blue-200">MP</div>
              <div className="h-3 w-full overflow-hidden rounded-full border border-blue-600 bg-stone-900">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                  style={{ width: `${(playerStats.mp / playerStats.maxMp) * 100}%` }}
                />
              </div>
              <div className="mt-1 text-right text-xs text-white">
                {playerStats.mp} / {playerStats.maxMp}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex-1 rounded-lg border-4 border-amber-700 bg-gradient-to-br from-amber-950/95 to-stone-950/95 p-4 shadow-2xl">
            <div className="mb-3 text-center text-sm font-bold text-amber-300">
              {playerTurn ? '⚔️ Votre Tour' : '⏳ Tour Ennemi...'}
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  console.log('🎯 Attaque !');
                  playerAttack();
                }}
                disabled={!playerTurn}
                className="w-full rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-6 py-3 font-bold text-white shadow-lg transition hover:from-red-500 hover:to-red-600 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
              >
                ⚔️ Attaquer
              </button>

              <button
                onClick={() => {
                  console.log('🛡️ Défense !');
                  playerDefend();
                }}
                disabled={!playerTurn}
                className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 font-bold text-white shadow-lg transition hover:from-blue-500 hover:to-blue-600 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
              >
                🛡️ Défendre
              </button>

              <button
                onClick={() => {
                  console.log('🏃 Fuite !');
                  playerFlee();
                }}
                disabled={!playerTurn}
                className="w-full rounded-lg bg-gradient-to-r from-gray-600 to-gray-700 px-6 py-3 font-bold text-white shadow-lg transition hover:from-gray-500 hover:to-gray-600 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
              >
                🏃 Fuir
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}