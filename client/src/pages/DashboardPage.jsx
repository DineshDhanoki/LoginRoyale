import React from 'react';
import { createSfx } from '../components/SoundEffects';

export default function DashboardPage() {
  const sfx = createSfx();
  React.useEffect(()=> { sfx.win(); }, []);
  return (
    <div className="app">
      <div className="card center" style={{maxWidth:760}}>
        <div className="h1">Welcome to your dashboard 🎉</div>
        <div className="small-muted">You successfully navigated the Royale login. This is a demo dashboard — hook real data here.</div>
      </div>
    </div>
  );
}
