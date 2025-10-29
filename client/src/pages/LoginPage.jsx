import React, { useState } from 'react';
import { login } from '../utils/api';
import Blackjack from '../components/Blackjack';
import { useNavigate } from 'react-router-dom';

/* Single page that toggles to blackjack on "Forgot password" */
export default function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login'); // 'login' or 'blackjack'
  const [status, setStatus] = useState('');
  const [newPassword, setNewPassword] = useState(null);

  async function handleLogin(e) {
    e.preventDefault();
    setStatus('Signing in...');
    const resp = await login(email, password);
    if (resp.success) {
      setStatus('Login ok');
      // proceed to verify step
      setTimeout(()=>nav('/verify'), 450);
    } else {
      setStatus(resp.message || 'Login failed');
    }
  }

  function handleBlackjackWin(pw) {
    setNewPassword(pw);
    setStatus('Password reset: ' + pw);
    // after a beat, return to login
    setTimeout(()=> setMode('login'), 1400);
  }

  return (
    <div className="app">
      <div className="card center" style={{maxWidth:640}}>
        {mode === 'login' ? (
          <>
            <div className="h1">Log in</div>
            <form onSubmit={handleLogin} style={{width:'100%'}}>
              <div className="col" style={{gap:8}}>
                <input className="input" placeholder="Email address" value={email} onChange={e=>setEmail(e.target.value)} />
                <input className="input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
                <button className="btn" type="submit">Sign in</button>
                <div className="row" style={{justifyContent:'space-between', marginTop:8}}>
                  <button type="button" className="btn ghost" onClick={()=>setMode('blackjack')}>Forgot password? Security Challenge</button>
                  <div className="small-muted">{status}</div>
                </div>
                {newPassword && <div style={{marginTop:10}} className="small-muted">Your new password: <strong style={{color:'#f4b942'}}>{newPassword}</strong></div>}
              </div>
            </form>
          </>
        ) : (
          <Blackjack onWin={handleBlackjackWin} />
        )}
      </div>
    </div>
  );
}
