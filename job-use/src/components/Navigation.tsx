import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    void navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-black/90 backdrop-blur-sm border-b border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-white">Job Use</span>
            </Link>

            {user && (
              <div className="hidden md:flex ml-10 space-x-8">
                <Link
                  to="/jobs"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors ${
                    isActive('/jobs')
                      ? 'text-orange-500 border-b-2 border-orange-500'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Jobs
                </Link>
                <Link
                  to="/applications"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors ${
                    isActive('/applications')
                      ? 'text-orange-500 border-b-2 border-orange-500'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  My Applications
                </Link>
                <Link
                  to="/profile"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors ${
                    isActive('/profile')
                      ? 'text-orange-500 border-b-2 border-orange-500'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  My Profile
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-400">
                  Welcome, {user.firstName}!
                </span>
                <button
                  onClick={handleLogout}
                  className="px-5 py-2 text-sm font-medium text-black bg-orange-500 rounded-full hover:bg-orange-400 transition-all transform hover:scale-105"
                >
                  Logout
                </button>
              </div>
            ) : location.pathname !== '/' ? (
              <Link
                to="/upload"
                className="px-5 py-2 text-sm font-medium text-black bg-orange-500 rounded-full hover:bg-orange-400 transition-all transform hover:scale-105"
              >
                Upload Profile
              </Link>
            ) : null}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-900"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && user && (
        <div className="md:hidden bg-black/95 border-t border-gray-900">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/jobs"
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive('/jobs')
                  ? 'text-orange-500 bg-gray-900'
                  : 'text-gray-400 hover:text-white hover:bg-gray-900'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Jobs
            </Link>
            <Link
              to="/applications"
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive('/applications')
                  ? 'text-orange-500 bg-gray-900'
                  : 'text-gray-400 hover:text-white hover:bg-gray-900'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              My Applications
            </Link>
            <Link
              to="/profile"
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive('/profile')
                  ? 'text-orange-500 bg-gray-900'
                  : 'text-gray-400 hover:text-white hover:bg-gray-900'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              My Profile
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;