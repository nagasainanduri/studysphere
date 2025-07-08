import { TwentyFirstToolbar } from '@21st-extension/toolbar-react';
import { ReactPlugin } from '@21st-extension/react';
import React, { useState, useEffect } from 'react';
import { initAuth, login, logout } from './components/auth/auth';

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
    <div style={{  position: 'relative', width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',color: 'white'}}>
      <h1 style={{ fontSize: '36px', marginBottom: '30px', fontWeight: 'bold' }}>
        StudySphere
      </h1>
      <button onClick={isAuthenticated ? handleLogout : handleLogin}
        style={{padding: '12px 24px',backgroundColor: isAuthenticated ? '#dc3545' : '#007bff',color: 'white',border: 'none',borderRadius: '6px',cursor: isLoading ? 'not-allowed' : 'pointer',fontSize: '16px',transition: 'background-color 0.3s',opacity: isLoading ? 0.6 : 1}}
        onMouseOver={(e) => !isLoading && (e.target.style.backgroundColor = isAuthenticated ? '#c82333' : '#0056b3')}
        onMouseOut={(e) => !isLoading && (e.target.style.backgroundColor = isAuthenticated ? '#dc3545' : '#007bff')}
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