import React, { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { createSfx } from './SoundEffects';

export default function DiceRoll({ onResult }) {
  const sfx = createSfx();
  const [die1, setDie1] = useState(null);
  const [die2, setDie2] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [message, setMessage] = useState('');
  const [rolling, setRolling] = useState(false);
  const controls1 = useAnimation();
  const controls2 = useAnimation();

  function Die3D({ value, controls }) {
    const size = 84;
    const depth = size / 2;
    const faceStyle = {
      position:'absolute', width:size, height:size, borderRadius:12, background:'#ffffff',
      boxShadow:'inset 0 0 0 2px rgba(0,0,0,0.06), inset 0 -6px 12px rgba(0,0,0,0.08)',
      display:'grid', gridTemplateColumns:'repeat(3,1fr)', gridTemplateRows:'repeat(3,1fr)',
      alignItems:'center', justifyItems:'center'
    };
    const pip = <div style={{width:10, height:10, background:'#0c1a2a', borderRadius:999}} />;
    const Faces = () => (
      <>
        {/* Front: 1 */}
        <div style={{...faceStyle, transform:`translateZ(${depth}px)`}}>
          <div /> <div /> <div />
          <div /> {pip} <div />
          <div /> <div /> <div />
        </div>
        {/* Back: 6 */}
        <div style={{...faceStyle, transform:`rotateY(180deg) translateZ(${depth}px)`}}>
          {pip} <div /> {pip}
          {pip} <div /> {pip}
          {pip} <div /> {pip}
        </div>
        {/* Right: 2 */}
        <div style={{...faceStyle, transform:`rotateY(90deg) translateZ(${depth}px)`}}>
          {pip} <div /> <div />
          <div /> <div /> <div />
          <div /> <div /> {pip}
        </div>
        {/* Left: 5 */}
        <div style={{...faceStyle, transform:`rotateY(-90deg) translateZ(${depth}px)`}}>
          {pip} <div /> {pip}
          <div /> {pip} <div />
          {pip} <div /> {pip}
        </div>
        {/* Top: 3 */}
        <div style={{...faceStyle, transform:`rotateX(90deg) translateZ(${depth}px)`}}>
          {pip} <div /> <div />
          <div /> {pip} <div />
          <div /> <div /> {pip}
        </div>
        {/* Bottom: 4 */}
        <div style={{...faceStyle, transform:`rotateX(-90deg) translateZ(${depth}px)`}}>
          {pip} <div /> {pip}
          <div /> <div /> <div />
          {pip} <div /> {pip}
        </div>
      </>
    );
    return (
      <div style={{position:'relative', width:size, height:size, perspective:1000}}>
        <motion.div
          animate={controls}
          style={{
            position:'absolute', inset:0, margin:'auto', width:size, height:size,
            transformStyle:'preserve-3d', willChange:'transform'
          }}
          transition={{ type:'spring', stiffness:180, damping:18 }}
        >
          <Faces />
        </motion.div>
        {/* soft shadow */}
        <div style={{position:'absolute', left:8, right:8, bottom:-10, height:18, borderRadius:18,
          background:'radial-gradient(ellipse at center, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 70%)', filter:'blur(2px)'}} />
      </div>
    );
  }

  function roll() {
    if (rolling) return;
    setRolling(true);
    sfx.dice();

    function targetFor(value) {
      switch (value) {
        case 1: return { rotateX: 0, rotateY: 0 };
        case 2: return { rotateY: -90, rotateX: 0 }; // right face
        case 3: return { rotateX: 90, rotateY: 0 }; // top face
        case 4: return { rotateX: -90, rotateY: 0 }; // bottom face
        case 5: return { rotateY: 90, rotateX: 0 }; // left face
        case 6: return { rotateY: 180, rotateX: 0 }; // back face
        default: return { rotateX: 0, rotateY: 0 };
      }
    }

    const a = 1 + Math.floor(Math.random()*6);
    const b = 1 + Math.floor(Math.random()*6);
    const t1 = targetFor(a);
    const t2 = targetFor(b);
    // spin in full turns so the final orientation matches the target face
    const turns1 = 3 + Math.floor(Math.random()*3); // 3-5 turns
    const turns2 = 3 + Math.floor(Math.random()*3);
    const spinExtra1 = 360 * turns1;
    const spinExtra2 = 360 * turns2;

    Promise.all([
      controls1.start({ rotateX: t1.rotateX + spinExtra1, rotateY: t1.rotateY + spinExtra1*0.6, rotateZ: 0, scale:[1,1.05,1], transition:{ duration:1.25, ease:[0.2,0.9,0.2,1] }}),
      controls2.start({ rotateX: t2.rotateX + spinExtra2, rotateY: t2.rotateY + spinExtra2*0.6, rotateZ: 0, scale:[1,1.05,1], transition:{ duration:1.25, ease:[0.2,0.9,0.2,1] }})
    ]).then(()=>{
      // settle with a tiny bounce to feel weighty
      controls1.start({ rotateZ: [0, -2, 0], transition:{ duration:0.25, ease:'easeOut' } });
      controls2.start({ rotateZ: [0, 2, 0], transition:{ duration:0.25, ease:'easeOut' } });
      setDie1(a); setDie2(b);
      setAttempts(x=>x+1);
      if (a === b) {
        sfx.win();
        setMessage('Doubles! 2FA complete.');
        onResult(true, a, b);
      } else {
        setMessage(`${a} - ${b} — No doubles, try again!`);
        onResult(false, a, b);
      }
      setRolling(false);
    });
  }

  return (
    <div className="col card" style={{maxWidth:560}}>
      <div className="h1 center">Two-Factor Authentication</div>
      <div className="small-muted">Roll doubles to complete two-factor authentication</div>

      <div style={{display:'flex', justifyContent:'center', gap:24, marginTop:18}}>
        <div style={{textAlign:'center'}}>
          <Die3D value={die1 ?? 1} controls={controls1} />
          <div className="small">Die 1</div>
        </div>
        <div style={{textAlign:'center'}}>
          <Die3D value={die2 ?? 1} controls={controls2} />
          <div className="small">Die 2</div>
        </div>
      </div>

      <div className="center" style={{marginTop:18}}>
        <button className="btn" onClick={roll} disabled={rolling}>{rolling ? 'Rolling...' : 'Roll for Access!'}</button>
        <div className="small-muted" style={{marginTop:10}}>Attempts: {attempts}</div>
        <div style={{marginTop:8, color:'#f4b942'}}>{message}</div>
      </div>
    </div>
  );
}
