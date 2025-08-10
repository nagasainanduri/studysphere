import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initAuth, login, logout } from '../components/auth/auth';
import '../pages/css/LandingPage.css';

const principalToString = (principal: unknown): string | null => {
  if (!principal) return null;
  if (typeof principal === 'string') return principal;
  if (typeof (principal as any).toText === 'function') return (principal as any).toText();
  if (typeof (principal as any).toString === 'function') return (principal as any).toString();
  return null;
};

const features = [
  {
    title: 'Collaborative Study Groups',
    desc: 'Join or create groups to learn together, share resources, and stay motivated.'
  },
  {
    title: 'NFT Study Notes',
    desc: 'Mint, buy, and sell unique study notes as NFTs to reward knowledge sharing.'
  },
  {
    title: 'Earn Study Tokens',
    desc: 'Participate, contribute, and earn tokens for your engagement and achievements.'
  }
];

const LandingPage: React.FC = () => {
  const [principal, setPrincipal] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    initAuth().then(async ({ principal, isAuthenticated }) => {
      setPrincipal(principalToString(principal));
      setIsAuthenticated(isAuthenticated);
      if (isAuthenticated) {
        // Check registration status
        try {
          const { studysphere_backend } = await import('../../../declarations/studysphere_backend');
          const user = await studysphere_backend.getUser();
          if (user && user[0] && user[0].username) {
            navigate('/profile');
          } else {
            navigate('/register');
          }
        } catch (err) {
          navigate('/register');
        }
      }
    });
  }, [navigate]);

  const handleLogin = () => {
    setIsLoading(true);
    login()
      .then(({ principal, isAuthenticated }) => {
        setPrincipal(principalToString(principal));
        setIsAuthenticated(isAuthenticated);
        setIsLoading(false);
        if (isAuthenticated) {
          navigate('/register');
        }
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const handleLogout = () => {
    logout();
    setPrincipal(null);
    setIsAuthenticated(false);
  };

  return (
    <div className="landing-root">
      {/* Header */}
      <header className="landing-header">
        <span className="landing-header-title">StudySphere</span>
        <button
          onClick={isAuthenticated ? handleLogout : handleLogin}
          className="landing-header-btn"
          disabled={isLoading}
          aria-label={isAuthenticated ? 'Logout' : 'Login with Internet Identity'}
        >
          {isLoading ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login'}
        </button>
      </header>

      {/* Hero Section */}
      <main className="landing-hero">
        <div className="landing-hero-bg1" />
        <div className="landing-hero-bg2" />
        <section>
          <h1 className="landing-hero-title">
            Level Up Your Learning
          </h1>
          <p className="landing-hero-desc">
            Connect, collaborate, and grow with StudySphere—where knowledge meets innovation.
          </p>
          <button
            onClick={isAuthenticated ? handleLogout : handleLogin}
            className="landing-hero-btn"
            disabled={isLoading}
            aria-label={isAuthenticated ? 'Logout' : 'Login with Internet Identity'}
          >
            {isLoading ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Get Started'}
          </button>
        </section>

        {/* Features Section */}
        <section className="landing-features">
          {features.map((feature, idx) => (
            <div
              key={feature.title}
              className="landing-feature-card"
            >
              <div className="landing-feature-icon">
                {String.fromCodePoint(0x1F393 + idx)}
              </div>
              <h3 className="landing-feature-title">{feature.title}</h3>
              <p className="landing-feature-desc">{feature.desc}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default LandingPage;