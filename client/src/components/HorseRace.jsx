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
  const [racePlan, setRacePlan] = useState([]); // {id, duration}
  const trackRef = React.useRef(null);
  const finishXRef = React.useRef(0);
  const winnerRef = React.useRef(null);

  function startRace() {
    if (!chosen) return alert('Pick a horse first.');
    if (!trackRef.current) return;
    const trackWidth = trackRef.current.clientWidth || 600;
    finishXRef.current = Math.max(120, trackWidth - 120);
    winnerRef.current = null;
    const plan = horses.map(h => ({
      id: h.id,
      duration: 2.6 + Math.random()*2.2 // 2.6s - 4.8s
    }));
    setRacePlan(plan);
    setRunning(true);
    sfx.spin();
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

      {/* Track */}
      <div ref={trackRef} style={{marginTop:16, padding:'16px 12px', borderRadius:8, background:'#041a28', border:'1px solid rgba(255,255,255,0.06)'}}>
        {horses.map(h => {
          const plan = racePlan.find(p => p.id === h.id);
          return (
            <div key={h.id} style={{position:'relative', height:54, marginBottom:10, background:'rgba(255,255,255,0.03)', borderRadius:999, overflow:'hidden'}}>
              <div style={{position:'absolute', top:0, bottom:0, left:110, right:110, borderBottom:'1px dashed rgba(255,255,255,0.06)'}} />
              <div style={{position:'absolute', left:12, top:14, fontWeight:700, opacity:0.7}}>Lane {h.id}</div>
              <motion.div
                initial={{ x: 0, y: 0 }}
                animate={running && plan ? { x: finishXRef.current, y: [0,-2,1,-1,0] } : { x: 0, y:0 }}
                transition={plan ? { duration: plan.duration, ease: 'easeInOut', times:[0,0.3,0.6,0.85,1] } : {}}
                onAnimationComplete={() => {
                  if (!running) return;
                  if (winnerRef.current == null) {
                    winnerRef.current = h.id;
                    const ok = chosen === h.id;
                    if (ok) sfx.win(); else sfx.click();
                    setRunning(false);
                    setAttempts(a=>a+1);
                    onResult(ok, h.id);
                  }
                }}
                style={{
                  position:'absolute', top:6, left:6, display:'flex', alignItems:'center', justifyContent:'center',
                  width:48, height:40,
                  background:'linear-gradient(180deg, #12354d, #0b283b)',
                  border:'1px solid rgba(255,255,255,0.12)',
                  borderRadius:999, boxShadow:'0 6px 20px rgba(0,0,0,0.35)'
                }}
              >
                <div style={{fontSize:24}}>{h.emoji}</div>
              </motion.div>
              <div style={{position:'absolute', right:10, top:14, fontSize:18}}>🏁</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
