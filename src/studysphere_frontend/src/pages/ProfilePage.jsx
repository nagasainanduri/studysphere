import React, { useEffect, useState } from 'react';
import { studysphere_backend } from '../../../declarations/studysphere_backend';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [createdGroups, setCreatedGroups] = useState([]);
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [userNotes, setUserNotes] = useState([]);
  const [tokens, setTokens] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // Fetch user data
        const userData = await studysphere_backend.getUser();
        if (userData) {
          setUser(userData);
          setNewUsername(userData.username || '');
          
          // Fetch user tokens
          const userTokens = await studysphere_backend.getTokens();
          setTokens(userTokens);

          // Fetch all groups
          const allGroups = await studysphere_backend.getGroups();
          const userPrincipal = userData.principal.toText();
          
          // Filter created groups
          const created = allGroups.filter(([_, group]) => group.creator.toText() === userPrincipal);
          setCreatedGroups(created);

          // Filter joined groups (including those not created by user)
          const joined = allGroups.filter(([_, group]) => 
            group.members.some(member => member.toText() === userPrincipal)
          );
          setJoinedGroups(joined);

          // Fetch user notes
          const notes = await studysphere_backend.getUserNotes(userData.principal);
          setUserNotes(notes);
        }
      } catch (err) {
        setError('Failed to fetch user data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleEditUsername = async () => {
    try {
      const success = await studysphere_backend.updateUser(newUsername);
      if (success) {
        setUser({ ...user, username: newUsername });
        setIsEditing(false);
      } else {
        setError('Failed to update username');
      }
    } catch (err) {
      setError('Error updating username');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-300 text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-300 text-lg">Please log in to view your profile</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-100 mb-4">User Profile</h1>
          
          {/* Username and Edit Button */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-200">Username: {user.username || 'Not set'}</h2>
              <p className="text-gray-400">Principal ID: {user.principal.toText()}</p>
              <p className="text-gray-400">Study Tokens: {tokens}</p>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-gray-700 hover:bg-gray-600 text-gray-200 px-4 py-2 rounded transition duration-200"
            >
              Edit Username
            </button>
          </div>

          {/* Edit Username Model */}
          {isEditing && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">Edit Username</h3>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full p-2 mb-4 bg-gray-700 text-gray-200 rounded border border-gray-600 focus:outline-none focus:border-gray-500"
                  placeholder="Enter new username"
                />
                {error && <p className="text-red-400 mb-4">{error}</p>}
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-600 hover:bg-gray-500 text-gray-200 px-4 py-2 rounded transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditUsername}
                    className="bg-gray-700 hover:bg-gray-600 text-gray-200 px-4 py-2 rounded transition duration-200"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Created Groups */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-200 mb-4">Created Groups</h2>
          {createdGroups.length === 0 ? (
            <p className="text-gray-400">You haven't created any groups yet.</p>
          ) : (
            <div className="grid gap-4">
              {createdGroups.map(([id, group]) => (
                <div key={id} className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-200">{group.name}</h3>
                  <p className="text-gray-400">ID: {id}</p>
                  <p className="text-gray-400">Created: {new Date(Number(group.createdAt) / 1000000).toLocaleString()}</p>
                  <p className="text-gray-400">Members: {group.members.length}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Joined Groups */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-200 mb-4">Joined Groups</h2>
          {joinedGroups.length === 0 ? (
            <p className="text-gray-400">You haven't joined any groups yet.</p>
          ) : (
            <div className="grid gap-4">
              {joinedGroups.map(([id, group]) => (
                <div key={id} className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-200">{group.name}</h3>
                  <p className="text-gray-400">ID: {id}</p>
                  <p className="text-gray-400">Created by: {group.creator.toText()}</p>
                  <p className="text-gray-400">Members: {group.members.length}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Owned Notes */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-200 mb-4">Owned Notes</h2>
          {userNotes.length === 0 ? (
            <p className="text-gray-400">You don't own any notes yet.</p>
          ) : (
            <div className="grid gap-4">
              {userNotes.map((note) => (
                <div key={note.id} className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-200">{note.title}</h3>
                  <p className="text-gray-400">Subject: {note.subject}</p>
                  <p className="text-gray-400">Price: {note.price} tokens</p>
                  <p className="text-gray-400">ID: {note.id}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;