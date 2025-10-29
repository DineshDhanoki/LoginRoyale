import React, { useState } from 'react';
import { createSfx } from './SoundEffects';
import { motion } from 'framer-motion';

export default function HorseRace({ onResult }) {
  const sfx = createSfx();
  const horses = [
    { id:1, name:'Thunder Bolt', emoji:'🐎' },
    { id:2, name:'Lightning Strike', emoji:'🏇' },
    { id:3, name:'Midnight Runner', emoji:'🐴' },
    { id:4, name:'Golden Gallop', emoji:'🦄' },
    { id:5, name:'Storm Chaser', emoji:'🐎' }
  ];
  const [chosen, setChosen] = useState(null);
  const [running, setRunning] = useState(false);
  const [attempts, setAttempts] = useState(0);

  function startRace() {
    if (!chosen) return alert('Pick a horse first.');
    setRunning(true);
    sfx.spin();
    // random winner
    setTimeout(()=> {
      const winner = horses[Math.floor(Math.random()*horses.length)];
      setAttempts(attempts + 1);
      const ok = chosen === winner.id;
      if (ok) sfx.win(); else sfx.click();
      setRunning(false);
      onResult(ok, winner.id);
    }, 1800 + Math.random()*900);
  }

  return (
    <div className="col card" style={{maxWidth:760}}>
      <div className="h1 center">Verify you are human</div>
      <div className="small-muted">Pick the Winning Horse</div>

      <div style={{marginTop:10, padding:14, borderRadius:8, background:'#06263b'}}>
        {horses.map(h=>(
          <div key={h.id} style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 14px', borderBottom:'1px dashed rgba(255,255,255,0.03)'}}>
            <div style={{display:'flex', gap:12, alignItems:'center'}}>
              <div style={{width:36}}>{h.emoji}</div>
              <div>{h.name}</div>
            </div>
            <div style={{display:'flex', gap:8}}>
              <button className="btn ghost" onClick={()=>setChosen(h.id)} style={{background: chosen===h.id ? 'linear-gradient(90deg,#3bbf9b,#2a9df4)': undefined}}>
                #{h.id}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="row" style={{marginTop:12}}>
        <button className="btn" onClick={startRace} disabled={running}>Start Race! 🏁</button>
        <div className="small-muted">Attempts: {attempts}</div>
      </div>
    </div>
  );
}
