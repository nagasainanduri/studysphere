import React, { useState } from 'react';
import { studysphere_backend } from '../../../declarations/studysphere_backend';
import { initAuth } from '../components/auth/auth';
import './css/HomePage.css';

const RegisterUser: React.FC = () => {
  const [username, setUsername] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    const auth = await initAuth();
    if (!auth.isAuthenticated || !auth.principal) {
      setStatus('error');
      setErrorMsg('You must be logged in to register.');
      return;
    }
    try {
      const result = await studysphere_backend.registerUser(username);
      if (result) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMsg('Registration failed. Username may already exist.');
      }
    } catch (err) {
      setStatus('error');
      setErrorMsg('An error occurred during registration.');
    }
  };

  return (
    <div className="homepage-root" style={{ minHeight: '100vh', justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
      <form className="homepage-section" style={{ maxWidth: 400, width: '100%' }} onSubmit={handleRegister}>
        <h2>Register User</h2>
        <label htmlFor="username" style={{ color: '#fff', fontWeight: 500, marginBottom: 8 }}>Username</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          style={{ width: '100%', padding: '0.8rem', borderRadius: 8, border: 'none', background: '#23232a', color: '#fff', fontSize: '1.1rem', marginBottom: 16 }}
        />
        <button
          type="submit"
          className="homepage-cta-btn"
          style={{ width: '100%', marginBottom: 12 }}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Registering...' : 'Register'}
        </button>
        {status === 'success' && (
          <div style={{ color: '#4caf50', marginTop: 8 }}>Registration successful!</div>
        )}
        {status === 'error' && (
          <div style={{ color: '#ff5252', marginTop: 8 }}>{errorMsg}</div>
        )}
      </form>
    </div>
  );
};

export default RegisterUser;
