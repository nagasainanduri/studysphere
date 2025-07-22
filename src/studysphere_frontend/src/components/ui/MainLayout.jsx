import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../ui/Navbar';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white/40 to-gray-100/20 text-gray-900 flex">
      <Navbar />
      <main className="flex-grow ml-16 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;