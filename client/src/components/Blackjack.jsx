import React, { useState } from 'react';
import { createSfx } from './SoundEffects';
import { resetPassword } from '../utils/api';

function cardValue(card) {
  const r = card.rank;
  if (r === 'A') return 11;
  if (['J','Q','K'].includes(r)) return 10;
  return Number(r);
}

function drawCard(deck) {
  return deck.splice(Math.floor(Math.random()*deck.length),1)[0];
}

function buildDeck() {
  const suits = ['♠','♥','♦','♣'];
  const ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
  const deck = [];
  suits.forEach(s => ranks.forEach(r => deck.push({ rank:r, suit:s })));
  return deck;
}

function CardView({ card, facedown=false, flip=false }) {
  const isRed = card && (card.suit === '♥' || card.suit === '♦');
  const front = (
    <div style={{
      width:56, height:80, borderRadius:8, background:'#fff', color:isRed?'#c0392b':'#071226',
      border:'1px solid rgba(0,0,0,0.08)', boxShadow:'0 4px 10px rgba(0,0,0,0.25)', position:'absolute', inset:0,
      display:'flex', alignItems:'center', justifyContent:'center', backfaceVisibility:'hidden'
    }}>
      <div style={{position:'absolute', top:6, left:6, fontSize:12, textAlign:'left'}}>
        <div>{card.rank}</div>
        <div>{card.suit}</div>
      </div>
      <div style={{fontSize:22}}>{card.suit}</div>
      <div style={{position:'absolute', bottom:6, right:6, fontSize:12, textAlign:'right', transform:'rotate(180deg)'}}>
        <div>{card.rank}</div>
        <div>{card.suit}</div>
      </div>
    </div>
  );
  const back = (
    <div style={{
      width:56, height:80, borderRadius:8, background:'linear-gradient(135deg,#1b3a55,#0e2233)',
      border:'1px solid rgba(255,255,255,0.15)', boxShadow:'0 4px 10px rgba(0,0,0,0.35)', position:'absolute', inset:0,
      backfaceVisibility:'hidden', transform:'rotateY(180deg)'
    }} />
  );
  if (!flip && facedown) return back;
  return (
    <div style={{position:'relative', width:56, height:80, perspective:600}}>
      <div style={{position:'absolute', inset:0, transformStyle:'preserve-3d', transform:`rotateY(${facedown ? 180 : 0}deg)`, transition: flip ? 'transform 500ms ease' : undefined}}>
        {front}
        {back}
      </div>
    </div>
  );
}

export default function Blackjack({ onWin }) {
  const sfx = createSfx();
  const [message, setMessage] = useState('');
  const [deck, setDeck] = useState(buildDeck());
  const [player, setPlayer] = useState([]);
  const [dealer, setDealer] = useState([]);
  const [ended, setEnded] = useState(false);
  const [loading, setLoading] = useState(false);

  async function start() {
    const d = buildDeck();
    const p = [drawCard(d), drawCard(d)];
    const del = [drawCard(d), drawCard(d)];
    setDeck(d); setPlayer(p); setDealer(del); setEnded(false); setMessage('');
  }

  function sumHand(h) {
    let sum = h.reduce((s,c)=>s+cardValue(c),0);
    // handle aces as 1 if over 21
    let aces = h.filter(x => x.rank==='A').length;
    while (sum > 21 && aces > 0) {
      sum -= 10;
      aces -= 1;
    }
    return sum;
  }

  async function stand() {
    // dealer plays
    sfx.click();
    let d = [...deck];
    let del = [...dealer];
    while (sumHand(del) < 17) {
      del.push(drawCard(d));
    }
    setDealer(del); setDeck(d);

    const playerScore = sumHand(player);
    const dealerScore = sumHand(del);

    if ((playerScore>21) || (dealerScore<=21 && dealerScore>=playerScore)) {
      setMessage('House wins! No password for you. Try again.');
      setEnded(true);
      return;
    }
    // player wins
    setMessage('You beat the house! Generating a new password...');
    setLoading(true);
    const resp = await resetPassword();
    setLoading(false);
    if (resp.success) {
      sfx.win();
      onWin(resp.newPassword);
    } else {
      setMessage('Server hiccup; try again.');
    }
    setEnded(true);
  }

  function hit() {
    sfx.click();
    const d = [...deck];
    const p = [...player];
    p.push(drawCard(d));
    setDeck(d); setPlayer(p);
    if (sumHand(p) > 21) {
      setMessage('Busted — house wins.');
      setEnded(true);
    }
  }

  // start initial
  React.useEffect(()=> { start(); }, []);

  return (
    <div className="col card" style={{maxWidth:560}}>
      <div className="h1 center">Beat the house to get your new password</div>

      <div className="small-muted" style={{marginBottom:12}}>
        Security Challenge: Win a hand of blackjack to generate your new password.
      </div>

      <div style={{display:'flex', justifyContent:'space-between', marginBottom:14}}>
        <div>
          <div className="small">Dealer ({ended ? sumHand(dealer) : '?'})</div>
          <div style={{display:'flex', gap:8, marginTop:8}}>
            {dealer.map((c,i)=>(
              <div key={i}>
                <CardView card={c} facedown={!ended && i===0} flip={i===0} />
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="small">You ({sumHand(player)})</div>
          <div style={{display:'flex', gap:8, marginTop:8}}>
            {player.map((c,i)=>(
              <div key={i}>
                <CardView card={c} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="row" style={{marginTop:6}}>
        <button className="btn" onClick={hit} disabled={ended}>Hit</button>
        <button className="btn ghost" onClick={stand} disabled={ended} style={{background:'#e04646', color:'#fff'}}>Stand</button>
        <button className="btn ghost" onClick={start} style={{border:'1px solid rgba(255,255,255,0.06)'}}>Play Again</button>
      </div>

      <div style={{marginTop:12}}>
        <div className="small-muted">{message}</div>
        {loading && <div className="small-muted">Generating... please wait.</div>}
      </div>
    </div>
  );
}
