import React, { useState } from 'react';
import { createSfx } from './SoundEffects';
import { resetPassword } from '../utils/api';

function cardValue(card) {
  if (card === 'A') return 11;
  if (['J','Q','K'].includes(card)) return 10;
  return Number(card);
}

function drawCard(deck) {
  return deck.splice(Math.floor(Math.random()*deck.length),1)[0];
}

function buildDeck() {
  const ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
  const deck = [];
  for (let i=0;i<4;i++) ranks.forEach(r=>deck.push(r));
  return deck;
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
    let aces = h.filter(x => x==='A').length;
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
              <div key={i} style={{padding:8,background:'#fff',color:'#071226',borderRadius:6,minWidth:36,textAlign:'center'}}>{c}</div>
            ))}
          </div>
        </div>

        <div>
          <div className="small">You ({sumHand(player)})</div>
          <div style={{display:'flex', gap:8, marginTop:8}}>
            {player.map((c,i)=>(
              <div key={i} style={{padding:8,background:'#fff',color:'#071226',borderRadius:6,minWidth:36,textAlign:'center'}}>{c}</div>
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
