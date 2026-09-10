import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthModal } from '../components/auth/AuthModal';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-screen min-h-screen flex items-center justify-center font-sans" style={{ backgroundColor: 'var(--bg-main)' }}>
      <AuthModal
        isOpen={true}
        onClose={() => navigate('/')}
        initialTab="login"
        onSuccessRedirect={() => navigate('/dashboard')}
      />
    </div>
  );
};

export default LoginPage;
