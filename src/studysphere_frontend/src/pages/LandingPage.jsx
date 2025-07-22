import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initAuth, login, logout } from '../components/auth/auth';
import logo from '../assets/logo2.png';
import '../assets/App.css';
import { motion } from 'framer-motion';

const LandingPage = () => {
  const [principal, setPrincipal] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    initAuth().then(({ principal, isAuthenticated }) => {
      setPrincipal(principal);
      setIsAuthenticated(isAuthenticated);
      if (isAuthenticated) {
        navigate('/profile');
      }
    });
  }, [navigate]);

  const handleLogin = () => {
    setIsLoading(true);
    login()
      .then(({ principal, isAuthenticated }) => {
        setPrincipal(principal);
        setIsAuthenticated(isAuthenticated);
        setIsLoading(false);
        if (isAuthenticated) {
          navigate('/profile');
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
    <div className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-br from-white/40 to-gray-100/20 text-gray-900 backdrop-blur-2xl">
      {/* Header */}
      <header className="w-full px-6 py-4 border-b border-white/20 bg-white/10 backdrop-blur-xl shadow-md">
        <div className="max-w-7xl mx-auto flex items-center">
          <img src={logo} alt="Logo" className="h-20" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full flex items-center justify-center px-6 py-12">
        <motion.div
          className="max-w-xl w-full text-center bg-white/10 border border-white/30 backdrop-blur-2xl rounded-3xl shadow-2xl p-10 transition duration-500"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <motion.h2
            className="text-4xl font-bold mb-4 text-gray-900"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Level Up Your Learning
          </motion.h2>
          <motion.p
            className="text-base text-gray-700 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            Connect with groups, craft NFT study notes, and unlock your potential—one token at a time.
          </motion.p>

          <motion.button
            onClick={isAuthenticated ? handleLogout : handleLogin}
            className={`px-8 py-3 font-semibold rounded-xl transition-all duration-300 border shadow-lg
              ${
                isAuthenticated
                  ? 'bg-white/10 hover:bg-white/20 border-white/30'
                  : 'bg-white/20 hover:bg-white/30 border-white/40'
              }
              text-gray-900 backdrop-blur-xl ${
                isLoading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
              }`}
            disabled={isLoading}
            aria-label={isAuthenticated ? 'Logout' : 'Login with Internet Identity'}
            whileHover={{ scale: isLoading ? 1 : 1.03 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
          >
            {isLoading ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login to Start'}
          </motion.button>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full px-6 py-4 border-t border-white/20 bg-white/10 backdrop-blur-xl text-center text-sm text-gray-600">
        © 2025 All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;