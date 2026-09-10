import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { StudentSidebar } from './StudentSidebar';
import { StudentHeader } from './StudentHeader';
import { EditProfileModal } from '../auth/EditProfileModal';

export const StudentLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  return (
    <div
      className="min-h-screen w-screen flex font-sans overflow-x-hidden transition-colors duration-200"
      style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}
    >
      {/* Permanent / Mobile Sidebar */}
      <StudentSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        <StudentHeader
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenProfileModal={() => setIsEditProfileOpen(true)}
        />

        {/* Dynamic Route Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          <Outlet />
        </main>
      </div>

      {/* Profile Edit Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />
    </div>
  );
};
