import React, { useState, useEffect } from 'react';
import { studysphere_backend } from '../../../declarations/studysphere_backend';

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('groups');
  const [groups, setGroups] = useState([]);
  const [notes, setNotes] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch initial groups on mount
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const allGroups = await studysphere_backend.getGroups();
        setGroups(allGroups);
      } catch (err) {
        setError('Failed to fetch groups');
        console.error(err);
      }
    };
    fetchGroups();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    try {
      if (searchType === 'groups') {
        const allGroups = await studysphere_backend.getGroups();
        const filteredGroups = allGroups.filter(([_, group]) =>
          group.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setGroups(filteredGroups);
        setNotes([]);
        setUsers([]);
      } else if (searchType === 'notes') {
        const foundNotes = await studysphere_backend.searchNotes(searchTerm);
        setNotes(foundNotes);
        setGroups([]);
        setUsers([]);
      } else if (searchType === 'users') {
        const user = await studysphere_backend.getUserByUsername(searchTerm);
        setUsers(user ? [user] : []);
        setGroups([]);
        setNotes([]);
      }
    } catch (err) {
      setError(`Failed to search ${searchType}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Search Header */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-100 mb-4">Search StudySphere</h1>
          
          {/* Search Input and Type Selector */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Search for ${searchType}...`}
              className="flex-grow p-2 bg-gray-700 text-gray-200 rounded border border-gray-600 focus:outline-none focus:border-gray-500"
            />
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="p-2 bg-gray-700 text-gray-200 rounded border border-gray-600 focus:outline-none focus:border-gray-500"
            >
              <option value="groups">Groups</option>
              <option value="notes">Notes</option>
              <option value="users">Users</option>
            </select>
            <button
              onClick={handleSearch}
              className="bg-gray-700 hover:bg-gray-600 text-gray-200 px-4 py-2 rounded transition duration-200"
            >
              Search
            </button>
          </div>
          {error && <p className="text-red-400">{error}</p>}
        </div>

        {/* Search Results */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-200 mb-4">Search Results</h2>
          
          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : (
            <>
              {/* Groups Results */}
              {searchType === 'groups' && (
                <div>
                  {groups.length === 0 ? (
                    <p className="text-gray-400">No groups found.</p>
                  ) : (
                    <div className="grid gap-4">
                      {groups.map(([id, group]) => (
                        <div key={id} className="bg-gray-700 p-4 rounded-lg">
                          <h3 className="text-lg font-medium text-gray-200">{group.name}</h3>
                          <p className="text-gray-400">ID: {id}</p>
                          <p className="text-gray-400">Creator: {group.creator.toText()}</p>
                          <p className="text-gray-400">Members: {group.members.length}</p>
                          <p className="text-gray-400">
                            Created: {new Date(Number(group.createdAt) / 1000000).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Notes Results */}
              {searchType === 'notes' && (
                <div>
                  {notes.length === 0 ? (
                    <p className="text-gray-400">No notes found.</p>
                  ) : (
                    <div className="grid gap-4">
                      {notes.map((note) => (
                        <div key={note.id} className="bg-gray-700 p-4 rounded-lg">
                          <h3 className="text-lg font-medium text-gray-200">{note.title}</h3>
                          <p className="text-gray-400">Subject: {note.subject}</p>
                          <p className="text-gray-400">Price: {note.price} tokens</p>
                          <p className="text-gray-400">Owner: {note.owner.toText()}</p>
                          <p className="text-gray-400">ID: {note.id}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Users Results */}
              {searchType === 'users' && (
                <div>
                  {users.length === 0 ? (
                    <p className="text-gray-400">No users found.</p>
                  ) : (
                    <div className="grid gap-4">
                      {users.map((user) => (
                        <div key={user.principal.toText()} className="bg-gray-700 p-4 rounded-lg">
                          <h3 className="text-lg font-medium text-gray-200">{user.username}</h3>
                          <p className="text-gray-400">Principal ID: {user.principal.toText()}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;