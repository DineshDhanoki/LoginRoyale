import React from 'react';
import Wheel from '../components/Wheel';
import { useNavigate } from 'react-router-dom';

export default function LoadingPage() {
  const nav = useNavigate();

  function onWheelResult(ms) {
    // Wait according to wheel result then go to login
    setTimeout(()=>nav('/login'), ms);
  }

  return (
    <div className="app">
      <div className="card center">
        <Wheel onResult={onWheelResult} />
        <div className="small-muted" style={{marginTop:14}}>This little game decides how long the page will take to load — because why not?</div>
      </div>
    </div>
  );
}
