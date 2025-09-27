import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAuth } from '../contexts/AuthContext';
import { Id } from '../../convex/_generated/dataModel';
import { useNavigate } from 'react-router-dom';

const MyApplications: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const applications = useQuery(api.applications.listApplications, {
    candidateId: user?._id,
  });

  const jobs = useQuery(api.jobs.listJobs, {});

  const getJobDetails = (jobId: Id<"jobs">) => {
    return jobs?.find(job => job._id === jobId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'reviewed':
        return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'accepted':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'rejected':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'reviewed':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        );
      case 'accepted':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'rejected':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block p-8 bg-gray-950 border border-gray-900 rounded-lg">
            <svg className="mx-auto h-12 w-12 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
            <p className="text-gray-500 mb-6">Please upload your profile to view applications</p>
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
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <span className="inline-block px-3 py-1 text-xs font-mono text-orange-500 border border-orange-500/30 rounded-full bg-orange-500/10">
              TRACKING
            </span>
            <span className="text-xs font-mono text-gray-500">
              {applications ? `${applications.length} APPLICATIONS` : 'LOADING...'}
            </span>
          </div>
          <h1 className="text-4xl font-bold">My Applications</h1>
        </div>

        {applications && applications.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {applications.map((application) => {
              const job = getJobDetails(application.jobId);
              if (!job) return null;

              return (
                <div key={application._id} className="group relative bg-gray-950 border border-gray-900 rounded-lg p-6 hover:border-gray-800 transition-all">
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-1">{job.title}</h3>
                      <p className="text-lg text-orange-500 font-medium">{job.company}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center text-gray-400 text-sm">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center text-gray-400 text-sm">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-medium">{job.salary}</span>
                        </div>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full flex items-center space-x-2 border ${getStatusColor(application.status)}`}>
                      {getStatusIcon(application.status)}
                      <span className="text-sm font-mono uppercase">{application.status}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-900">
                    <div className="text-xs text-gray-600 font-mono">
                      APPLIED {new Date(application.appliedDate).toLocaleDateString()}
                    </div>
                    <button
                      onClick={() => void navigate(`/apply/${job._id}`)}
                      className="text-sm font-mono text-orange-500 hover:text-orange-400 transition-colors"
                    >
                      VIEW DETAILS →
                    </button>
                  </div>

                  {application.coverLetter && (
                    <details className="mt-4">
                      <summary className="cursor-pointer text-sm font-mono text-gray-500 hover:text-gray-400">
                        VIEW COVER LETTER
                      </summary>
                      <div className="mt-2 p-4 bg-gray-900 border border-gray-800 rounded-lg">
                        <p className="text-sm text-gray-400 whitespace-pre-wrap">
                          {application.coverLetter}
                        </p>
                      </div>
                    </details>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-block p-12 bg-gray-950 border border-gray-900 rounded-lg">
              <svg className="mx-auto h-12 w-12 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="text-lg font-semibold text-white mb-2">No Applications Yet</h3>
              <p className="text-gray-500 mb-6">Start applying to jobs to track your progress</p>
              <button
                onClick={() => void navigate('/jobs')}
                className="px-6 py-3 text-black bg-orange-500 rounded-full hover:bg-orange-400 transition-all transform hover:scale-105"
              >
                Browse Jobs
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;