import React from 'react';
import { Candidate } from '../types';

interface ProfileCardProps {
  candidate: Candidate;
  onEdit?: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ candidate, onEdit }) => {
  return (
    <div className="bg-gray-950 border border-gray-900 rounded-lg p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">
            {candidate.firstName} {candidate.lastName}
          </h2>
          <p className="text-lg text-emerald-500 font-medium mt-1">
            {candidate.currentJobTitle}
          </p>
          <p className="text-gray-400">
            {candidate.currentCompany}
          </p>
        </div>
        {onEdit && (
          <button
            onClick={onEdit}
            className="px-4 py-2 text-sm font-medium text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 rounded-full hover:bg-emerald-500/20 transition-colors"
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className="space-y-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-3">
              Contact Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center text-gray-400">
                <svg className="w-4 h-4 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">{candidate.email}</span>
              </div>
              <div className="flex items-center text-gray-400">
                <svg className="w-4 h-4 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-sm">{candidate.phone}</span>
              </div>
              <div className="flex items-center text-gray-400">
                <svg className="w-4 h-4 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm">{candidate.county}, {candidate.country}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-3">
              Professional Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Experience</span>
                <span className="text-sm text-white font-medium">{candidate.experience} years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Expected Salary</span>
                <span className="text-sm text-white font-medium">${candidate.salary}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Work Auth</span>
                <span className={`text-sm font-medium ${candidate.eligibilityToWork ? 'text-green-400' : 'text-red-400'}`}>
                  {candidate.eligibilityToWork ? 'Authorized' : 'Not Authorized'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-900 pt-6">
        <h3 className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-3">
          Profile Summary
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed">
          {candidate.profileSummary}
        </p>
      </div>

      {candidate.cvUploaded && (
        <div className="mt-6 flex items-center">
          <div className="flex items-center text-green-400 text-sm">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-mono">CV UPLOADED</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;