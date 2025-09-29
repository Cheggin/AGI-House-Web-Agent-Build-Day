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


  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block p-8 bg-gray-950 border border-gray-900 rounded-lg">
            <svg className="mx-auto h-12 w-12 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
            <p className="text-gray-500 mb-6">Please upload your profile to view agent traces</p>
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
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <span className="inline-block px-3 py-1 text-xs font-mono text-emerald-500 border border-emerald-500/30 rounded-full bg-emerald-500/10">
              AI AGENT
            </span>
            <span className="text-xs font-mono text-gray-500">
              {applications ? `${applications.length} AUTOMATED APPLICATIONS` : 'LOADING...'}
            </span>
          </div>
          <h1 className="text-4xl font-bold">Agent Trace</h1>
          <p className="text-gray-400 mt-2">Monitor AI agent actions and application automation</p>
        </div>

        {applications && applications.length > 0 ? (
          <div className="space-y-6">
            {applications.map((application) => {
              const job = getJobDetails(application.jobId);
              if (!job) return null;

              return (
                <div key={application._id} className="bg-gray-950 border border-gray-900 rounded-lg overflow-hidden">
                  {/* Application Header */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white">{job.title}</h3>
                        <p className="text-emerald-500 font-medium">{job.company}</p>
                        <p className="text-sm text-gray-400 mt-1">{job.location}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full border ${getStatusColor(application.status)}`}>
                        <span className="text-sm font-mono uppercase">{application.status}</span>
                      </div>
                    </div>

                    {/* Agent Summary */}
                    {application.agentSummary && (
                      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                        <h4 className="text-xs font-mono text-emerald-500 uppercase mb-2">AGENT SUMMARY</h4>
                        <div className="text-sm text-gray-300 whitespace-pre-wrap break-words font-mono">
                          {application.agentSummary}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="px-6 pb-4 flex justify-between items-center">
                    <span className="text-xs text-gray-600 font-mono">
                      APPLIED {new Date(application.appliedDate).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => void navigate(`/jobs`)}
                      className="text-sm font-mono text-emerald-500 hover:text-emerald-400 transition-colors"
                    >
                      VIEW JOB →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-block p-12 bg-gray-950 border border-gray-900 rounded-lg">
              <svg className="mx-auto h-12 w-12 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg font-semibold text-white mb-2">No Agent Traces Yet</h3>
              <p className="text-gray-500 mb-6">Start applying to jobs to see AI automation in action</p>
              <button
                onClick={() => void navigate('/jobs')}
                className="px-6 py-3 text-black bg-emerald-500 rounded-full hover:bg-emerald-400 transition-all transform hover:scale-105"
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