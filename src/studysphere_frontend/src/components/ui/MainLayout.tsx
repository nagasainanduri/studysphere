import React from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

const MainLayout: React.FC = () => {
  return (
    <div className="main-layout-root" style={{ minHeight: '100vh', background: 'none' }}>
      <Navbar />
      <div className="main-layout-content" style={{ paddingTop: 32 }}>
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
