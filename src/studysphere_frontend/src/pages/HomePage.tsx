import React, { useEffect, useState } from 'react';
import { studysphere_backend } from '../../../declarations/studysphere_backend';
import { initAuth } from '../components/auth/auth';
import { Link, useNavigate } from 'react-router-dom';
import './css/HomePage.css';

interface GroupInfo {
  id: string;
  name: string;
  creator: string;
  members: string[];
  createdAt: number;
}

interface NoteNFT {
  id: number;
  title: string;
  subject: string;
  content: string;
  price: number;
  owner: string;
}

const HomePage: React.FC = () => {
  const [userName, setUserName] = useState<string>('');
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [groups, setGroups] = useState<GroupInfo[]>([]);
  const [notes, setNotes] = useState<NoteNFT[]>([]);
  const [userCount, setUserCount] = useState<number>(0);
  const [announcements, setAnnouncements] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<NoteNFT[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      const auth = await initAuth();
      let principal = null;
      if (auth.isAuthenticated && auth.principal) {
        principal = auth.principal;
      }
      // Get user info
      let userNameVal = 'Guest';
      if (principal) {
        const user = await studysphere_backend.getUser();
        userNameVal = user && user[0] && user[0].username ? user[0].username : 'User';
      }
      setUserName(userNameVal);
      // Get token balance
      let tokens = 0;
      if (principal) {
        tokens = Number(await studysphere_backend.getTokens());
      }
      setTokenBalance(Number(tokens));
      // Get all groups
      const allGroups: [bigint, any][] = await studysphere_backend.getGroups();
      const groupList = allGroups.map(([id, info]) => ({ ...info, id: id.toString() }));
      setGroups(groupList);
      // Get user count
      const totalUsers = await studysphere_backend.getUserCount();
      setUserCount(Number(totalUsers));
      // Get recent notes (latest 6 minted by any user)
      let recentNotes: NoteNFT[] = [];
      if (principal) {
        const userNotes = await studysphere_backend.getUserNotes(principal);
        recentNotes = userNotes.slice(-6).map((n: any) => ({
          id: n.id,
          title: n.title,
          subject: n.subject,
          content: n.content,
          price: n.price,
          owner: n.owner,
        }));
      }
      setNotes(recentNotes);
      // Get announcements/messages from a public group (if exists)
      const publicGroup = groupList.find(g => g.name.toLowerCase().includes('announcement') || g.name.toLowerCase().includes('public'));
      if (publicGroup && principal) {
        const msgs = await studysphere_backend.getMessages(BigInt(publicGroup.id));
        if (msgs && msgs[0]) {
          setAnnouncements(msgs[0].map((m: any) => m.content));
        }
      }
      setLoading(false);
    };
    fetchHomeData();
  }, [navigate]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    const results = await studysphere_backend.searchNotes(searchTerm);
    setSearchResults(results.map((n: any) => ({
      id: n.id,
      title: n.title,
      subject: n.subject,
      content: n.content,
      price: n.price,
      owner: n.owner,
    })));
  };

  if (loading) {
    return (
      <div className="homepage-root homepage-loading-full">
        <div className="homepage-hero">
          <h1>Loading StudySphere...</h1>
        </div>
      </div>
    );
  }

  // Featured groups: top 4 by member count
  const featuredGroups = [...groups].sort((a, b) => b.members.length - a.members.length).slice(0, 4);

  return (
    <div className="homepage-root">
      {/* Hero Section */}
      <section className="homepage-hero">
        <div className="homepage-hero-bg" />
        <div className="homepage-hero-content">
          <h1 className="homepage-title">Welcome, {userName}!</h1>
          <p className="homepage-subtitle">Collaborate. Learn. Earn. <br />
            <span className="homepage-highlight">StudySphere</span> is your all-in-one academic hub.
          </p>
          <div className="homepage-hero-stats">
            <div className="homepage-stat-card"><span>{userCount}</span><label>Users</label></div>
            <div className="homepage-stat-card"><span>{groups.length}</span><label>Groups</label></div>
            <div className="homepage-stat-card"><span>{tokenBalance}</span><label>Tokens</label></div>
          </div>
          <div className="homepage-hero-actions">
            <Link to="/groups" className="homepage-cta-btn">Join a Group</Link>
            <Link to="/notes" className="homepage-cta-btn">Mint a Note</Link>
            <Link to="/tokens" className="homepage-cta-btn">Earn Tokens</Link>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <main className="homepage-main-grid">
        {/* Featured Groups */}
        <section className="homepage-section homepage-groups">
          <h2>Featured Study Groups</h2>
          <div className="homepage-card-grid">
            {featuredGroups.length === 0 ? (
              <div className="homepage-card">No groups available yet.</div>
            ) : (
              featuredGroups.map(group => (
                <div className="homepage-card" key={group.id}>
                  <h3>{group.name}</h3>
                  <p>{group.members.length} members</p>
                  <Link to={`/groups/${group.id}`} className="homepage-card-link">View Group</Link>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Notes Marketplace */}
        <section className="homepage-section homepage-notes">
          <h2>Recently Minted Notes</h2>
          <div className="homepage-card-grid">
            {notes.length === 0 ? (
              <div className="homepage-card">No notes minted yet.</div>
            ) : (
              notes.map(note => (
                <div className="homepage-card" key={note.id}>
                  <h3>{note.title}</h3>
                  <p>{note.subject} &mdash; {note.price} STK</p>
                  <Link to={`/notes/${note.id}`} className="homepage-card-link">View Note</Link>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Announcements */}
        <section className="homepage-section homepage-announcements">
          <h2>Announcements</h2>
          <div className="homepage-announcement-list">
            {announcements.length === 0 ? (
              <div className="homepage-announcement">No announcements yet.</div>
            ) : (
              announcements.slice(-3).map((msg, idx) => (
                <div className="homepage-announcement" key={idx}>{msg}</div>
              ))
            )}
          </div>
        </section>

        {/* Search Notes */}
        <section className="homepage-section homepage-search">
          <h2>Search Notes</h2>
          <div className="homepage-search-bar">
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by title or subject..."
            />
            <button onClick={handleSearch}>Search</button>
          </div>
          {searchResults.length > 0 && (
            <div className="homepage-card-grid homepage-search-results">
              {searchResults.map(note => (
                <div className="homepage-card" key={note.id}>
                  <h3>{note.title}</h3>
                  <p>{note.subject} &mdash; {note.price} STK</p>
                  <Link to={`/notes/${note.id}`} className="homepage-card-link">View Note</Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* About/Commercial Section */}
      <section className="homepage-section homepage-about">
        <h2>Why StudySphere?</h2>
        <p>
          StudySphere is your commercial hub for collaborative learning: join vibrant study groups, mint and trade notes, earn tokens, and stay updated with the latest announcements. Experience a new era of academic achievement.
        </p>
      </section>
    </div>
  );
};

export default HomePage;
