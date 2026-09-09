import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export default function PortalLayout() {
  return (
    <div className="min-h-screen bg-app-bg text-slate-900 font-sans flex flex-col">
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm">
        <Link to="/" className="text-xl font-bold text-primary">VisualLab</Link>
        <div className="flex gap-4">
          <button className="px-4 py-2 text-slate-600 hover:text-primary transition-colors">Đăng nhập</button>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="py-6 text-center text-slate-500 text-sm border-t border-slate-200 bg-white">
        &copy; 2026 VisualLab Vietnam
      </footer>
    </div>
  );
}
