// app/game/page.tsx
'use client';

import dynamic from 'next/dynamic';

const GameCanvas = dynamic(() => import('@/components/game/GameCanvas'), {
  ssr: false,
});

export default function GamePage() {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      <GameCanvas />
    </div>
  );
}