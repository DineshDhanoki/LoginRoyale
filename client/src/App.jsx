import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import LoadingPage from './pages/LoadingPage';
import LoginPage from './pages/LoginPage';
import VerifyPage from './pages/VerifyPage';
import TwoFactorPage from './pages/TwoFactorPage';
import DashboardPage from './pages/DashboardPage';

export default function App() {
  const [theme, setTheme] = React.useState('dark');

  function toggleTheme() {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    // minimal theme switching via CSS variables (left simple)
    if (theme === 'dark') {
      document.documentElement.style.setProperty('--bg','#f8fafc');
      document.documentElement.style.setProperty('--card','#ffffff');
      document.documentElement.style.setProperty('--muted','#334155');
    } else {
      document.documentElement.style.setProperty('--bg','#071226');
      document.documentElement.style.setProperty('--card','#122437');
      document.documentElement.style.setProperty('--muted','#a8bacb');
    }
  }

  return (
    <BrowserRouter>
      <div style={{position:'fixed', top:12, right:12, zIndex:80}}>
        <button className="btn ghost" onClick={toggleTheme}>Toggle Theme</button>
      </div>

      <Routes>
        <Route path="/" element={<LoadingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify" element={<VerifyPage />} />
        <Route path="/2fa" element={<TwoFactorPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}
