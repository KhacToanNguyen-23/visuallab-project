import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { TeacherSidebar } from '../components/teacher/TeacherSidebar';
import { TeacherHeader } from '../components/teacher/TeacherHeader';
import { EditProfileModal } from '../components/auth/EditProfileModal';
import { useAuth } from '../context/AuthContext';
import { classService } from '../services/classService';

export const TeacherLayout: React.FC = () => {
  const { user } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [classCount, setClassCount] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (user?.id) {
      classService.getTeacherClasses(user.id).then(classes => {
        setClassCount(classes ? classes.length : 0);
      }).catch(() => {
        setClassCount(0);
      });
    }
  }, [user]);

  return (
    <div
      className="min-h-screen w-screen flex font-sans overflow-x-hidden transition-colors duration-200"
      style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}
    >
      {/* Permanent / Mobile Sidebar */}
      <TeacherSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        classCount={classCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        <TeacherHeader
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
