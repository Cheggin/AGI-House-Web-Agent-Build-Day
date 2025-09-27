import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ProfileCard from '../components/ProfileCard';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block p-8 bg-gray-950 border border-gray-900 rounded-lg">
            <svg className="mx-auto h-12 w-12 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <h2 className="text-2xl font-bold mb-4">No Profile Found</h2>
            <p className="text-gray-500 mb-6">Please upload your profile to get started</p>
            <button
              onClick={() => void navigate('/upload')}
              className="px-6 py-3 text-black bg-orange-500 rounded-full hover:bg-orange-400 transition-all transform hover:scale-105"
            >
              Upload Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <span className="inline-block px-3 py-1 text-xs font-mono text-orange-500 border border-orange-500/30 rounded-full bg-orange-500/10">
              PROFILE
            </span>
            <span className="text-xs font-mono text-gray-500">
              AUTHENTICATED USER
            </span>
          </div>
          <h1 className="text-3xl font-bold">My Profile</h1>
        </div>
        <ProfileCard candidate={user} />
      </div>
    </div>
  );
};

export default Profile;