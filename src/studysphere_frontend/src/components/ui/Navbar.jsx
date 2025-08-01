import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 h-full w-16 bg-gray-800 border-r border-gray-600 flex flex-col items-center py-6 space-y-6">
      {/* Home */}
      <NavLink
        to="/home"
        className={({ isActive }) =>
          `p-2 rounded-lg transition-all duration-300 ${isActive ? 'bg-gray-700' : 'hover:bg-gray-600'}`
        }
        aria-label="Home"
      >
        <svg className="w-6 h-6 fill-current text-gray-200" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
      </NavLink>

      {/* Search */}
      <NavLink
        to="/search"
        className={({ isActive }) =>
          `p-2 rounded-lg transition-all duration-300 ${isActive ? 'bg-gray-700' : 'hover:bg-gray-600'}`
        }
        aria-label="Search"
      >
        <svg className="w-6 h-6 fill-current text-gray-200" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
        </svg>
      </NavLink>

      {/* Groups */}
      <NavLink
        to="/groups"
        className={({ isActive }) =>
          `p-2 rounded-lg transition-all duration-300 ${isActive ? 'bg-gray-700' : 'hover:bg-gray-600'}`
        }
        aria-label="Groups"
      >
        <svg className="w-6 h-6 fill-current text-gray-200" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
        </svg>
      </NavLink>

      {/* Profile */}
      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `p-2 rounded-lg transition-all duration-300 ${isActive ? 'bg-gray-700' : 'hover:bg-gray-600'}`
        }
        aria-label="Profile"
      >
        <svg className="w-6 h-6 fill-current text-gray-200" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      </NavLink>

      {/* Divider */}
      <div className="w-8 h-px bg-gray-600"></div>

      {/* GitHub */}
      <a
        href="https://github.com/your-username/studysphere"
        className="p-2 rounded-lg hover:bg-gray-600 transition-all duration-300"
        aria-label="GitHub"
      >
        <svg className="w-6 h-6 fill-current text-gray-200" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.333-1.756-1.333-1.756-1.087-.744.083-.729.083-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
      </a>

      {/* Contact */}
      <a
        href="mailto:contact@studysphere.org"
        className="p-2 rounded-lg hover:bg-gray-600 transition-all duration-300"
        aria-label="Contact"
      >
        <svg className="w-6 h-6 fill-current text-gray-200" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2l-8 5-8-5V6l8 5 8-5z" />
        </svg>
      </a>
    </nav>
  );
};

export default Navbar;