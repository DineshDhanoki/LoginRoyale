import React from 'react';
import DiceRoll from '../components/DiceRoll';
import { twoFactor } from '../utils/api';
import { useNavigate } from 'react-router-dom';

export default function TwoFactorPage() {
  const nav = useNavigate();

  async function handleDiceResult(ok, d1, d2) {
    // tell server about it (demo)
    const resp = await twoFactor(d1, d2);
    if (resp.success) {
      setTimeout(()=>nav('/dashboard'), 500);
    } else {
      // nothing special — allow re-roll
    }
  }

  return (
    <div className="app">
      <div className="card center" style={{maxWidth:700}}>
        <DiceRoll onResult={handleDiceResult} />
      </div>
    </div>
  );
}
