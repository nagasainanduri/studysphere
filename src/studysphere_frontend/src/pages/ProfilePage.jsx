import React, { useEffect, useState } from 'react';
import { getUser, registerUser, updateUser } from '../api/userApi';

const ProfilePage = ({ principal }) => {
  const [user, setUser] = useState(null); // Loaded user data
  const [usernameInput, setUsernameInput] = useState(''); // Input field state
  const [message, setMessage] = useState({ text: '', isError: false });
  const [loading, setLoading] = useState(true);

  // Fetch existing user data
  useEffect(() => {
    async function loadUser() {
      try {
        const fetchedUser = await getUser(principal.toText());
        setUser(fetchedUser);
        setUsernameInput(fetchedUser?.username || '');
      } catch (err) {
        setMessage({ text: 'Failed to load user data.', isError: true });
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [principal]);

  // Submit new/updated username
  const handleSave = async (e) => {
    e.preventDefault();
    if (usernameInput.length === 0 || usernameInput.length > 20) {
      setMessage({ text: 'Username should be 1–20 characters.', isError: true });
      return;
    }

    try {
      if (!user) {
        await registerUser(usernameInput);
      } else {
        await updateUser(usernameInput);
      }

      const updatedUser = await getUser(principal.toText());
      setUser(updatedUser);
      setMessage({ text: 'Username saved successfully!', isError: false });
    } catch (err) {
      setMessage({ text: 'Error saving username.', isError: true });
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>👤 Profile</h2>

      {!user?.username ? (
        <div>
          <p>It looks like you haven't set a username yet.</p>
          <form onSubmit={handleSave}>
            <input
              type="text"
              placeholder="Enter username"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
            />
            <button type="submit">Save Username</button>
          </form>
        </div>
      ) : (
        <div>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Principal:</strong> {principal.toText()}</p>
          <p><strong>Created At:</strong> {new Date(Number(user.createdAt) / 1_000_000).toLocaleString()}</p>
          <p><strong>Updated At:</strong> {new Date(Number(user.updatedAt) / 1_000_000).toLocaleString()}</p>

          <h4>Update Username</h4>
          <form onSubmit={handleSave}>
            <input
              type="text"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
            />
            <button type="submit">Update</button>
          </form>
        </div>
      )}

      {message.text && (
        <div style={{ color: message.isError ? 'red' : 'green', marginTop: '1rem' }}>
          {message.text}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
