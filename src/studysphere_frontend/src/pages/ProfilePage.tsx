import React, { useEffect, useState } from 'react';
import { studysphere_backend } from '../../../declarations/studysphere_backend';
import { useNavigate } from 'react-router-dom';
import { initAuth, logout } from '../components/auth/auth';
import { FaKey, FaCoins, FaTwitter, FaGithub, FaEnvelope, FaUserCircle } from 'react-icons/fa';
import '../pages/css/ProfilePage.css';

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

const ProfilePage: React.FC = () => {
  const [principal, setPrincipal] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [myGroups, setMyGroups] = useState<GroupInfo[]>([]);
  const [createdGroups, setCreatedGroups] = useState<GroupInfo[]>([]);
  const [notes, setNotes] = useState<NoteNFT[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Stats
  const stats = [
    { label: 'Groups Joined', value: myGroups.length },
    { label: 'Groups Created', value: createdGroups.length },
    { label: 'Notes Minted', value: notes.length },
    { label: 'Tokens', value: tokenBalance },
  ];

  // Basic recent activity (latest group joined, note minted)
  const recentGroup = myGroups.length > 0 ? myGroups[myGroups.length - 1].name : null;
  const recentNote = notes.length > 0 ? notes[notes.length - 1].title : null;

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const auth = await initAuth();
      if (!auth.isAuthenticated || !auth.principal) {
        navigate('/');
        return;
      }
      const principalStr = typeof auth.principal === 'string' ? auth.principal : (auth.principal.toText ? auth.principal.toText() : auth.principal.toString());
      setPrincipal(principalStr);
      // Get registered username
      const userObj = await studysphere_backend.getUser();
      if (userObj && userObj[0] && userObj[0].username) {
        setUsername(userObj[0].username);
      } else {
        setUsername('User');
      }
      // Get token balance
      const tokens = await studysphere_backend.getTokens();
      setTokenBalance(Number(tokens));
      // Get all groups
      const allGroups: [bigint, any][] = await studysphere_backend.getGroups();
      setMyGroups(
        allGroups
          .filter(([_, info]) => info.members.some((m: string) => m === principalStr))
          .map(([id, info]) => ({ ...info, id: id.toString() }))
      );
      setCreatedGroups(
        allGroups
          .filter(([_, info]) => info.creator === principalStr)
          .map(([id, info]) => ({ ...info, id: id.toString() }))
      );
      // Get user's notes
      const userNotes = await studysphere_backend.getUserNotes(auth.principal);
      setNotes(userNotes.map((n: any) => ({
        id: n.id,
        title: n.title,
        subject: n.subject,
        content: n.content,
        price: n.price,
        owner: n.owner,
      })));
      setLoading(false);
    };
    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="profile-root profile-center">
        <div className="profile-bg-anim">
          <div className="profile-bg-shape profile-bg-shape1" />
          <div className="profile-bg-shape profile-bg-shape2" />
          <div className="profile-bg-shape profile-bg-shape3" />
        </div>
        <div className="profile-card profile-loading">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="profile-root">
      <div className="profile-bg-anim">
        <div className="profile-bg-shape profile-bg-shape1" />
        <div className="profile-bg-shape profile-bg-shape2" />
        <div className="profile-bg-shape profile-bg-shape3" />
      </div>
      <main className="profile-main">
        <section className="profile-account-card-ux">
          <button className="profile-account-logout-btn-ux" onClick={handleLogout} title="Logout">
            ⎋
          </button>
          <div className="profile-account-avatar-ux">
            <FaUserCircle size={64} className="profile-account-avatar-icon-ux" />
          </div>
          <div className="profile-account-username-ux">{username}</div>
          <div className="profile-account-balance-pill-ux">
            <FaCoins className="profile-account-balance-icon-ux" />
            <span>{tokenBalance} Tokens</span>
          </div>
          <div className="profile-account-stats-row-ux">
            <div className="profile-account-stat-ux">
              <span className="profile-account-stat-value-ux">{myGroups.length}</span>
              <span className="profile-account-stat-label-ux">Groups Joined</span>
            </div>
            <div className="profile-account-stat-ux">
              <span className="profile-account-stat-value-ux">{createdGroups.length}</span>
              <span className="profile-account-stat-label-ux">Groups Created</span>
            </div>
            <div className="profile-account-stat-ux">
              <span className="profile-account-stat-value-ux">{notes.length}</span>
              <span className="profile-account-stat-label-ux">Notes Minted</span>
            </div>
          </div>
        </section>
        <section className="profile-content-grid">
          <div className="profile-section-card">
            <div className="profile-section-title">Groups Joined</div>
            <div className="profile-section-divider" />
            {myGroups.length === 0 ? (
              <div className="profile-section-desc">You have not joined any groups yet.</div>
            ) : (
              <ul className="profile-list">
                {myGroups.map(group => (
                  <li key={group.id} className="profile-list-item">
                    <span className="profile-list-main">{group.name}</span>
                    <span className="profile-list-sub">(Members: {group.members.length})</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="profile-section-card">
            <div className="profile-section-title">Groups Created</div>
            <div className="profile-section-divider" />
            {createdGroups.length === 0 ? (
              <div className="profile-section-desc">You have not created any groups yet.</div>
            ) : (
              <ul className="profile-list">
                {createdGroups.map(group => (
                  <li key={group.id} className="profile-list-item">
                    <span className="profile-list-main">{group.name}</span>
                    <span className="profile-list-sub">(Members: {group.members.length})</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="profile-section-card">
            <div className="profile-section-title">My Notes</div>
            <div className="profile-section-divider" />
            {notes.length === 0 ? (
              <div className="profile-section-desc">You have not minted or own any notes yet.</div>
            ) : (
              <ul className="profile-list">
                {notes.map(note => (
                  <li key={note.id} className="profile-list-item">
                    <span className="profile-list-main">{note.title}</span>
                    <span className="profile-list-sub">({note.subject})</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProfilePage;
