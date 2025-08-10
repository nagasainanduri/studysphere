import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AiFillHome } from 'react-icons/ai';
import { FiSearch } from 'react-icons/fi';
import { HiUsers } from 'react-icons/hi';
import { BsFileEarmarkText } from 'react-icons/bs';
import { FaUserCircle } from 'react-icons/fa';
import '../css/Navbar.css';

const navItems = [
  { name: 'Home', path: '/home', icon: <AiFillHome size={26} /> },
  { name: 'Search', path: '/search', icon: <FiSearch size={24} /> },
  { name: 'Groups', path: '/groups', icon: <HiUsers size={25} /> },
  { name: 'Notes', path: '/notes', icon: <BsFileEarmarkText size={23} /> },
  { name: 'Profile', path: '/profile', icon: <FaUserCircle size={25} /> },
];

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  return (
    <nav className="navbar-root navbar-floating">
      <div className="navbar-inner">
        <span className="navbar-logo" onClick={() => navigate('/home')}>
          StudySphere
        </span>
        <div className="navbar-links">
          {navItems.map(item => (
            <NavLink
              key={item.name}
              to={item.path}
              aria-label={item.name}
              className={({ isActive }) =>
                isActive ? 'navbar-link navbar-link-active' : 'navbar-link'
              }
            >
              {item.icon}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
