import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../ui/Navbar';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex">
      <Navbar />
      <main className="flex-grow ml-16 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;