import React from 'react';
import { Outlet } from 'react-router-dom';

export default function LabLayout() {
  return (
    <div className="h-screen w-screen bg-app-bg text-slate-900 font-sans overflow-hidden">
      <Outlet />
    </div>
  );
}
