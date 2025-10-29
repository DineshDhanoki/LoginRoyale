import React from 'react';
import HorseRace from '../components/HorseRace';
import { verifyHorse } from '../utils/api';
import { useNavigate } from 'react-router-dom';

export default function VerifyPage() {
  const nav = useNavigate();

  async function handleResult(ok, winnerId) {
    // for demo we just let client compute random winner; call server verify optional
    // call server to check (demo)
    // assume chosen is passed as well (component already had chosen)
    // Here we'll just implement a quick logic
    if (ok) {
      // proceed
      setTimeout(()=>nav('/2fa'), 800);
    } else {
      alert('Incorrect horse — try again.');
    }
  }

  return (
    <div className="app">
      <div style={{width:'100%'}} className="center">
        <div className="card" style={{maxWidth:820}}>
          <HorseRace onResult={(ok, winner)=>handleResult(ok, winner)} />
        </div>
      </div>
    </div>
  );
}
