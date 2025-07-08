import React, { useState, useEffect } from 'react';
import { initAuth, login, logout } from './components/auth/auth';
import logo from './assets/sample.png';
import './assets/App.css';

/**
 * Main application component.
 * @returns {JSX.Element} Start page with login button and status.
 */

const App = () => {
  const [principal, setPrincipal] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    initAuth().then(({ principal, isAuthenticated }) => {
      setPrincipal(principal);
      setIsAuthenticated(isAuthenticated);
    });
  }, []);
  const handleLogin = () => {
    setIsLoading(true);
    login().then(({ principal, isAuthenticated }) => {
      setPrincipal(principal);
      setIsAuthenticated(isAuthenticated);
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });
  };

  const handleLogout = () => {
    logout();
    setPrincipal(null);
    setIsAuthenticated(false);
  };

  return (
    <div style={{  position: 'relative', width: '50%', height: '100vh', display: 'relative', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',float: 'right',color: '#000',backgroundColor: '#fff'}}>
      <img src={logo} alt="StudySphere Logo" style={{height: 'auto', marginTop:'32%', marginBottom: '10px', objectFit: 'contain'}}/> <br/>
      <button onClick={isAuthenticated ? handleLogout : handleLogin}
        style={{padding: '12px 24px',backgroundColor: isAuthenticated ? '#dc3545' : '#121111',color: 'white',border: 'none',borderRadius: '6px',cursor: isLoading ? 'not-allowed' : 'pointer',fontSize: '16px',transition: 'background-color 0.3s',opacity: isLoading ? 0.6 : 1}}
        onMouseOver={(e) => !isLoading && (e.target.style.backgroundColor = isAuthenticated ? '#c82333' : '#121225')}
        onMouseOut={(e) => !isLoading && (e.target.style.backgroundColor = isAuthenticated ? '#dc3545' : '#121111')}
        disabled={isLoading}
      >
        {isLoading ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login with Internet Identity'}
      </button>
      {isAuthenticated && principal && !isLoading && (
        <p style={{ marginTop: '20px', fontSize: '14px' }}>
          Authenticated as {principal.toString()}
        </p>
      )}
    </div>
  );
};

export default App;