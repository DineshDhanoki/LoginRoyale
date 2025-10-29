import React, { useState } from 'react';
import { createSfx } from './SoundEffects';

export default function DiceRoll({ onResult }) {
  const sfx = createSfx();
  const [die1, setDie1] = useState(null);
  const [die2, setDie2] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [message, setMessage] = useState('');

  function roll() {
    sfx.dice();
    const a = 1 + Math.floor(Math.random()*6);
    const b = 1 + Math.floor(Math.random()*6);
    setDie1(a); setDie2(b);
    setAttempts(attempts+1);
    if (a === b) {
      sfx.win();
      setMessage('Doubles! 2FA complete.');
      onResult(true, a, b);
    } else {
      setMessage(`${a} - ${b} — No doubles, try again!`);
      onResult(false, a, b);
    }
  }

  return (
    <div className="col card" style={{maxWidth:560}}>
      <div className="h1 center">Two-Factor Authentication</div>
      <div className="small-muted">Roll doubles to complete two-factor authentication</div>

      <div style={{display:'flex', justifyContent:'center', gap:18, marginTop:18}}>
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:48, background:'#fff', color:'#071226', borderRadius:8, padding:8, width:84}}>{die1 ?? '—'}</div>
          <div className="small">Die 1</div>
        </div>
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:48, background:'#fff', color:'#071226', borderRadius:8, padding:8, width:84}}>{die2 ?? '—'}</div>
          <div className="small">Die 2</div>
        </div>
      </div>

      <div className="center" style={{marginTop:18}}>
        <button className="btn" onClick={roll}>Roll for Access!</button>
        <div className="small-muted" style={{marginTop:10}}>Attempts: {attempts}</div>
        <div style={{marginTop:8, color:'#f4b942'}}>{message}</div>
      </div>
    </div>
  );
}
