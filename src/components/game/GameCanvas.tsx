// components/game/GameCanvas.tsx
'use client';

import { useEffect, useRef } from 'react';
import { Game } from '@/lib/game/core/Game';
import { CombatHUD } from './CombatHUD';

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Game | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    console.log('🎮 Initializing game...');

    const game = new Game(canvasRef.current);
    game.start();
    gameRef.current = game;

    console.log('✅ Game started!');

    return () => {
      console.log('🛑 Disposing game...');
      if (gameRef.current) {
        gameRef.current.dispose();
      }
    };
  }, []);

  console.log('🎨 GameCanvas render');

  return (
    <>
      <canvas ref={canvasRef} className="block h-screen w-screen" />
      <CombatHUD />
    </>
  );
}