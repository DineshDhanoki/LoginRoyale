import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { createSfx } from './SoundEffects';

const sectors = [
  { label:'0.5s', value: 500 },
  { label:'1s', value: 1000 },
  { label:'2s', value: 2000 },
  { label:'3s', value: 3000 },
  { label:'5s', value: 5000 },
  { label:'8s', value: 8000 },
  { label:'10s', value:10000 },
  { label:'15s', value:15000 }
];

export default function Wheel({ onResult }) {
  const ringRef = useRef();
  const [spinning, setSpinning] = useState(false);
  const sfx = createSfx();

  function spin() {
    if (spinning) return;
    setSpinning(true);
    sfx.spin();
    // choose sector with weighted-ish randomness
    const idx = Math.floor(Math.random()*sectors.length);
    const chosen = sectors[idx];
    // create a CSS rotation that lands on the chosen sector
    const degreesPer = 360 / sectors.length;
    const fullRounds = 6 + Math.floor(Math.random()*4);
    // Align visual with pointer at 12 o'clock (90deg from CSS 0deg at 3 o'clock)
    const centerAngle = idx*degreesPer + degreesPer/2;
    const targetDeg = fullRounds*360 + (90 - centerAngle);
    // animate using framer/motion by setting style transform, but simpler: inline transition
    const el = ringRef.current;
    if (!el) return;
    el.style.transition = 'transform 3s cubic-bezier(.12,.9,.25,1)';
    el.style.transform = `rotate(${targetDeg}deg)`;
    setTimeout(()=> {
      setSpinning(false);
      // pass the time value to parent
      onResult(chosen.value);
    }, 3200);
  }

  return (
    <div className="center col">
      <div style={{marginBottom:14}}>Spin the wheel to load the page</div>
      <div style={{position:'relative', width:340, height:340, margin:'0 auto'}}>
        <div ref={ringRef} style={{
          width:'100%', height:'100%', borderRadius:999, border:'10px solid rgba(0,0,0,0.5)',
          background: 'conic-gradient(#ff6b6b 0 45deg,#ffd93d 45deg 90deg,#4bd3a6 90deg 135deg,#52a0ff 135deg 180deg,#b07cff 180deg 225deg,#ff7ab6 225deg 270deg,#5fd3d3 270deg 315deg,#f79a3c 315deg 360deg)',
          display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden'
        }}>
          {/* numeric labels that rotate with the wheel */}
          <div style={{position:'absolute', inset:0, pointerEvents:'none'}}>
            {sectors.map((s, i) => {
              const degPer = 360 / sectors.length;
              const ang = i * degPer + degPer/2;
              const r = 120;
              return (
                <div key={i} style={{
                  position:'absolute',
                  left:'50%', top:'50%',
                  transform:`rotate(${ang}deg) translate(${r}px)`,
                  transformOrigin:'center',
                  fontSize:14, fontWeight:700, color:'#0b1a2a',
                  textShadow:'0 1px 0 rgba(255,255,255,0.6), 0 0 6px rgba(0,0,0,0.35)'
                }}>
                  {s.label}
                </div>
              );
            })}
          </div>
          <div style={{width:40, height:40, borderRadius:40, background:'#071226'}}></div>
        </div>
        <div style={{position:'absolute', top:-8, left:'50%', transform:'translateX(-50%)', width:0, height:0, borderLeft:'8px solid transparent', borderRight:'8px solid transparent', borderBottom:'14px solid var(--accent)'}} />
      </div>

      <div className="space" />
      <button className="btn" onClick={spin} disabled={spinning}>
        {spinning ? 'Spinning...' : 'Continue'}
      </button>
      <div className="small-muted">
        The wheel randomly selects a small wait time, just for fun.
      </div>
    </div>
  );
}
