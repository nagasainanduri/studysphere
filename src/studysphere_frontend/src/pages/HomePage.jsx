import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { studysphere_backend } from '../../../declarations/studysphere_backend';

const HomePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [userGroups, setUserGroups] = useState([]);
  const [userNotes, setUserNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        // Fetch user profile
        const userData = await studysphere_backend.getUser();
        if (userData[0]) {
          setUser(userData[0]);
        }

        // Fetch token balance
        const balance = await studysphere_backend.getBalance();
        setTokenBalance(Number(balance));

        // Fetch user groups
        const groups = await studysphere_backend.getUserGroups();
        setUserGroups(groups.slice(0, 3)); // Limit to 3 for display

        // Fetch user notes
        const notes = await studysphere_backend.getUserNotes();
        setUserNotes(notes.slice(0, 3)); // Limit to 3 for display
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-6">
      {/* Welcome Section */}
      <motion.section
        className="mb-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-gray-100 mb-2">
          Welcome, {user ? user.username : 'Learner'}!
        </h2>
        <p className="text-lg text-gray-400">
          Connect, Learn, and Earn on the Internet Computer Blockchain
        </p>
      </motion.section>

      {/* Quick Actions */}
      <section className="mb-12">
        <h3 className="text-xl font-semibold text-gray-200 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.button
            className="bg-gray-800 border border-gray-600 rounded-xl p-4 text-center text-gray-200 hover:bg-gray-700 transition-all duration-300"
            onClick={() => navigate('/groups')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <h4 className="font-semibold">Study Groups</h4>
            <p className="text-sm text-gray-400">Create or join groups to collaborate.</p>
          </motion.button>
          <motion.button
            className="bg-gray-800 border border-gray-600 rounded-xl p-4 text-center text-gray-200 hover:bg-gray-700 transition-all duration-300"
            onClick={() => navigate('/search')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <h4 className="font-semibold">Browse Notes</h4>
            <p className="text-sm text-gray-400">Explore NFT study notes.</p>
          </motion.button>
          <motion.button
            className="bg-gray-800 border border-gray-600 rounded-xl p-4 text-center text-gray-200 hover:bg-gray-700 transition-all duration-300"
            onClick={() => navigate('/profile')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <h4 className="font-semibold">Your Profile</h4>
            <p className="text-sm text-gray-400">View tokens and notes.</p>
          </motion.button>
        </div>
      </section>

      {/* User Dashboard */}
      <section className="mb-12">
        <h3 className="text-xl font-semibold text-gray-200 mb-4">Your Dashboard</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Token Balance */}
          <div className="bg-gray-800 border border-gray-600 rounded-xl p-6">
            <h4 className="font-semibold text-gray-200">StudyTokens</h4>
            <p className="text-2xl text-gray-300">{isLoading ? 'Loading...' : `${tokenBalance} Tokens`}</p>
          </div>
          {/* Recent Groups */}
          <div className="bg-gray-800 border border-gray-600 rounded-xl p-6">
            <h4 className="font-semibold text-gray-200">Recent Groups</h4>
            {isLoading ? (
              <p className="text-gray-400">Loading...</p>
            ) : userGroups.length > 0 ? (
              <ul className="list-disc list-inside text-gray-400">
                {userGroups.map((group) => (
                  <li key={group.id} className="truncate">{group.name}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">
                No groups yet.{' '}
                <a href="/groups" className="text-gray-300 hover:underline">
                  Join one!
                </a>
              </p>
            )}
          </div>
          {/* Recent Notes */}
          <div className="bg-gray-800 border border-gray-600 rounded-xl p-6">
            <h4 className="font-semibold text-gray-200">Recent Notes</h4>
            {isLoading ? (
              <p className="text-gray-400">Loading...</p>
            ) : userNotes.length > 0 ? (
              <ul className="list-disc list-inside text-gray-400">
                {userNotes.map((note) => (
                  <li key={note.id} className="truncate">{note.title}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">
                No notes yet.{' '}
                <a href="/search" className="text-gray-300 hover:underline">
                  Create one!
                </a>
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Featured Content */}
      <section className="mb-12">
        <h3 className="text-xl font-semibold text-gray-200 mb-4">Explore StudySphere</h3>
        <div className="bg-gray-800 border border-gray-600 rounded-xl p-6">
          <p className="text-gray-400 mb-2">
            Discover popular study groups and trending NFT notes to boost your learning.
          </p>
          <div className="flex space-x-4">
            <button
              className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-all duration-300"
              onClick={() => navigate('/groups')}
            >
              Popular Groups
            </button>
            <button
              className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-all duration-300"
              onClick={() => navigate('/search')}
            >
              Trending Notes
            </button>
          </div>
        </div>
      </section>

      {/* ICP Branding */}
      <section className="text-center">
        <p className="text-sm text-gray-500">
          Powered by{' '}
          <a href="https://internetcomputer.org" className="text-gray-300 hover:underline">
            Internet Computer (ICP)
          </a>
        </p>
      </section>
    </div>
  );
};

export default HomePage;