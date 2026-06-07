import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import loginIllustration from '../assets/login-illustration.svg';

export const AuthLayout: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Redirect authenticated users away from auth pages (e.g. /login)
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen w-screen bg-white border border-neutral-300">
      {/* Left Side: Illustration Panel (hidden on mobile) */}
      <div className="hidden md:flex md:w-1/2 bg-[#f6f9fc] items-center justify-center p-12 border-r border-neutral-300 select-none">
        <div className="max-w-lg w-full flex flex-col items-center">
          <img
            src={loginIllustration}
            alt="PrepRoute Login Illustration"
            className="w-full h-auto max-h-[480px]"
            draggable={false}
          />
        </div>
      </div>

      {/* Right Side: Form Panel */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-12 sm:px-12 lg:px-20 bg-white">
        <div className="w-full max-w-[400px] animate-fade-in-up">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
