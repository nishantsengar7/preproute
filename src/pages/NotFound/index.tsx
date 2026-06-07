import React from 'react';
import { useNavigate } from 'react-router-dom';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const NotFound: React.FC = () => {
  useDocumentTitle('Page Not Found');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="max-w-md w-full text-center animate-fade-in-up">
        {/* Large 404 number */}
        <p className="text-[120px] font-black text-neutral-900/5 leading-none select-none mb-0">
          404
        </p>
        <div className="-mt-8 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto mb-6">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#4F83F1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
              <line x1="11" y1="8" x2="11" y2="11" />
              <line x1="11" y1="14" x2="11.01" y2="14" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-neutral-900 mb-2">Page not found</h1>
          <p className="text-sm text-neutral-500 leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-sm font-semibold rounded-lg transition-colors"
          >
            Go back
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-5 py-2.5 bg-[#4F83F1] hover:bg-[#3D72E1] text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
