import React from 'react';
import type { User } from '../../context/AuthContext';
import { AdminWorkspace } from './workspaces/AdminWorkspace';
import { TeacherWorkspace } from './workspaces/TeacherWorkspace';
import { StudentWorkspace } from './workspaces/StudentWorkspace';

interface RoleWorkspacePanelProps {
  user: User | null;
  onEditProfile: () => void;
}

export const RoleWorkspacePanel: React.FC<RoleWorkspacePanelProps> = ({ user, onEditProfile }) => {
  const role = user?.role || 'STUDENT';

  if (role === 'ADMIN') {
    return <AdminWorkspace user={user} />;
  }

  if (role === 'TEACHER') {
    return <TeacherWorkspace user={user} />;
  }

  // DEFAULT TO STUDENT
  return <StudentWorkspace user={user} onEditProfile={onEditProfile} />;
};
