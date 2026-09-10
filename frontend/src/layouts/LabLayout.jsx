import React from 'react';
import { Outlet } from 'react-router-dom';

export default function LabLayout() {
  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col transition-colors duration-200" style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}>
      <Outlet />
    </div>
  );
}
