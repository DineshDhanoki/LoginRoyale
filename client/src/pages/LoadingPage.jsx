import React from 'react';
import Wheel from '../components/Wheel';
import { useNavigate } from 'react-router-dom';

export default function LoadingPage() {
  const nav = useNavigate();
  const [loadingMs, setLoadingMs] = React.useState(0);
  const [remainingMs, setRemainingMs] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const intervalRef = React.useRef(null);

  function onWheelResult(ms) {
    // Start timed loading with visible progress and ETA
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setLoadingMs(ms);
    setRemainingMs(ms);
    setIsLoading(true);

    const startTs = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTs;
      const rem = Math.max(ms - elapsed, 0);
      setRemainingMs(rem);
      if (rem <= 0) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsLoading(false);
        nav('/login');
      }
    }, 100);
  }

  return (
    <div className="app">
      <div className="card center">
        <Wheel onResult={onWheelResult} />
        <div className="small-muted" style={{marginTop:14}}>This little game decides how long the page will take to load — because why not?</div>

        {isLoading && (
          <div style={{marginTop:16, width: '100%'}}>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:6}}>
              <div className="small">Loading...</div>
              <div className="small">
                {Math.ceil(remainingMs/1000)}s remaining
              </div>
            </div>
            <div style={{height:10, background:'rgba(255,255,255,0.08)', borderRadius:8, overflow:'hidden'}}>
              <div style={{
                height:'100%',
                width: `${Math.min(100, Math.max(0, loadingMs ? (100 - (remainingMs / loadingMs) * 100) : 0))}%`,
                background: 'linear-gradient(90deg, #3bbf9b, #2a9df4)',
                transition: 'width 100ms linear'
              }} />
            </div>
            <div className="small-muted" style={{marginTop:6, textAlign:'right'}}>
              {Math.round(loadingMs ? (100 - (remainingMs / loadingMs) * 100) : 0)}%
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
