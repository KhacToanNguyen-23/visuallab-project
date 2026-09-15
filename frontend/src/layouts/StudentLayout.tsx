import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { StudentSidebar } from '../components/student/StudentSidebar';
import { StudentHeader } from '../components/student/StudentHeader';
import { EditProfileModal } from '../components/auth/EditProfileModal';
import { useAuth } from '../context/AuthContext';
import { classService } from '../services/classService';
import { assignmentService } from '../services/assignmentService';

export const StudentLayout: React.FC = () => {
  const { user } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [classCount, setClassCount] = useState<number | undefined>(undefined);
  const [assignmentCount, setAssignmentCount] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (user?.id) {
      classService.getStudentEnrollments(user.id).then(async (enrollments) => {
        const enrList = enrollments || [];
        setClassCount(enrList.length);
        let totalAsgs = 0;
        await Promise.all(
          enrList.map(async (e) => {
            const asgs = await assignmentService.getAssignmentsByClass(e.classId);
            totalAsgs += (asgs || []).length;
          })
        );
        setAssignmentCount(totalAsgs);
      }).catch(() => {
        setClassCount(0);
        setAssignmentCount(0);
      });
    }
  }, [user?.id]);

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
        classCount={classCount}
        assignmentCount={assignmentCount}
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
