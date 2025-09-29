import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAuth } from '../contexts/AuthContext';
import ProfileCard from '../components/ProfileCard';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const jobExperiences = useQuery(api.jobExperiences.getJobExperiencesByCandidate,
    user ? { candidateId: user._id } : 'skip'
  );

  const questions = useQuery(api.questions.getQuestionsByCandidate,
    user ? { candidateId: user._id } : 'skip'
  );

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
              className="px-6 py-3 text-black bg-emerald-500 rounded-full hover:bg-emerald-400 transition-all transform hover:scale-105"
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
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <span className="inline-block px-3 py-1 text-xs font-mono text-emerald-500 border border-emerald-500/30 rounded-full bg-emerald-500/10">
              PROFILE
            </span>
            <span className="text-xs font-mono text-gray-500">
              COMPREHENSIVE VIEW
            </span>
          </div>
          <h1 className="text-3xl font-bold">My Profile</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile Card */}
          <div className="lg:col-span-2">
            <ProfileCard candidate={user} />

            {/* Job Experiences Section */}
            {jobExperiences && jobExperiences.length > 0 && (
              <div className="mt-6 bg-gray-950 border border-gray-900 rounded-lg p-6">
                <h2 className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-4">
                  WORK EXPERIENCE
                </h2>
                <div className="space-y-4">
                  {jobExperiences.map((exp) => (
                    <div key={exp._id} className="border-l-2 border-emerald-500/30 pl-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{exp.title}</h3>
                          <p className="text-emerald-500 font-medium">{exp.company}</p>
                        </div>
                        {exp.currentJob && (
                          <span className="px-2 py-1 text-xs font-mono text-green-400 bg-green-400/10 border border-green-400/20 rounded-full">
                            CURRENT
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-mono text-gray-600 mb-2">
                        {new Date(exp.startDate).toLocaleDateString()} - {exp.currentJob ? 'Present' : new Date(exp.endDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-400 leading-relaxed">{exp.scope}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Side Panel with Questions */}
          <div className="lg:col-span-1">
            {/* Questions Section */}
            {questions && questions.length > 0 && (
              <div className="bg-gray-950 border border-gray-900 rounded-lg p-6">
                <h2 className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-4">
                  PROFILE QUESTIONS
                </h2>
                <div className="space-y-4 overflow-y-auto pr-2" style={{ maxHeight: 'calc(100vh - 300px)' }}>
                  {questions.map((q) => (
                    <div key={q._id} className="pb-3 border-b border-gray-800 last:border-0">
                      <p className="text-xs font-mono text-emerald-500 mb-1">{q.intent || q.questionType}</p>
                      <p className="text-sm text-white font-medium mb-2">{q.name}</p>
                      <p className="text-sm text-gray-400">{q.answer}</p>
                      {q.answered && (
                        <span className="inline-block mt-2 text-xs font-mono text-green-400">
                          ✓ ANSWERED
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;