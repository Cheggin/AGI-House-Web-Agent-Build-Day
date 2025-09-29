import React, { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAuth } from '../contexts/AuthContext';
import { Id } from '../../convex/_generated/dataModel';
import { useNavigate } from 'react-router-dom';

const DeepResearch: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState<Id<"jobs"> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showData, setShowData] = useState(false);

  const jobs = useQuery(api.jobs.listJobs, {});
  const researchData = useQuery(
    api.research.getDeepResearch,
    selectedJob && showData ? { jobId: selectedJob } : "skip"
  );

  const fetchResearch = (jobId: Id<"jobs">) => {
    setSelectedJob(jobId);
    setIsLoading(true);
    setShowData(false);

    // Pause for 8 seconds before showing the research data
    setTimeout(() => {
      setIsLoading(false);
      setShowData(true);
    }, 8000);
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
            <p className="text-gray-500 mb-6">Please upload your profile to access AI research</p>
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
              AI RESEARCH
            </span>
            <span className="text-xs font-mono text-gray-500">
              POWERED BY ADVANCED WEB SCRAPING
            </span>
          </div>
          <h1 className="text-4xl font-bold">Deep Research</h1>
          <p className="text-gray-400 mt-2">AI-powered company insights and recommendations</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Job Selection Panel */}
          <div className="bg-gray-950 border border-gray-900 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 text-emerald-500">Select a Job to Research</h2>
            <div className="space-y-3">
              {jobs?.map((job) => (
                <button
                  key={job._id}
                  onClick={() => fetchResearch(job._id)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    selectedJob === job._id
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : 'bg-gray-900 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{job.title}</h3>
                      <p className="text-emerald-500 text-sm">{job.company}</p>
                      <p className="text-gray-500 text-xs mt-1">{job.location}</p>
                    </div>
                    {selectedJob === job._id && (
                      <span className="text-xs font-mono text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">
                        {isLoading ? 'RESEARCHING...' : 'SELECTED'}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Research Results Panel */}
          <div className="bg-gray-950 border border-gray-900 rounded-lg p-6">
            {!selectedJob ? (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <p className="text-gray-500">Select a job to see AI research insights</p>
                </div>
              </div>
            ) : isLoading ? (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
                  <p className="text-gray-400 font-mono text-sm">AI AGENT RESEARCHING...</p>
                  <p className="text-gray-600 text-xs mt-2">Analyzing company data and web sources</p>
                </div>
              </div>
            ) : researchData && showData ? (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-3 text-emerald-500">Research Results</h2>

                  {/* Company Summary */}
                  <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 mb-4">
                    <h3 className="text-xs font-mono text-emerald-500 uppercase mb-3">COMPANY OVERVIEW</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {researchData.Summary}
                    </p>
                  </div>

                  {/* AI Recommendation */}
                  <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 mb-4">
                    <h3 className="text-xs font-mono text-emerald-500 uppercase mb-3">AI RECOMMENDATION</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {researchData.Recommendation}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 mt-6">
                    <button
                      onClick={() => {
                        const job = jobs?.find(j => j._id === selectedJob);
                        if (job) {
                          void navigate('/jobs');
                        }
                      }}
                      className="flex-1 px-4 py-2 text-sm font-medium text-black bg-emerald-500 rounded-full hover:bg-emerald-400 transition-all transform hover:scale-105"
                    >
                      Apply to This Position
                    </button>
                    <button className="px-4 py-2 text-sm font-mono text-emerald-500 border border-emerald-500/30 rounded-full hover:bg-emerald-500/10 transition-all">
                      Export Research
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Research History */}
        <div className="mt-8 bg-gray-950 border border-gray-900 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-emerald-500">Recent Research History</h2>
          <div className="text-center py-8 text-gray-600">
            <p className="text-sm">Your research history will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeepResearch;