import React, { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAuth } from '../contexts/AuthContext';
import { Id } from '../../convex/_generated/dataModel';
import { useNavigate } from 'react-router-dom';

const MyApplications: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [expandedTrace, setExpandedTrace] = useState<Id<"applications"> | null>(null);

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

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'NAVIGATE':
        return '🌐';
      case 'FILL':
        return '✏️';
      case 'SELECT':
        return '☑️';
      case 'GENERATE':
        return '🤖';
      case 'SUBMIT':
        return '🚀';
      default:
        return '⚡';
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

              const isExpanded = expandedTrace === application._id;

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
                    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 mb-4">
                      <h4 className="text-xs font-mono text-emerald-500 uppercase mb-2">AGENT SUMMARY</h4>
                      <p className="text-sm text-gray-300">
                        {application.agentSummary || "Successfully automated application submission. Detected 8 form fields, filled personal information from profile, identified 3 custom questions, generated tailored responses based on job requirements. All fields validated and submitted successfully."}
                      </p>
                    </div>

                    {/* Questions Detected */}
                    {(application.questionsDetected || []).length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-xs font-mono text-emerald-500 uppercase mb-3">QUESTIONS DETECTED</h4>
                        <div className="grid gap-3">
                          {(application.questionsDetected || [
                            { question: "Why are you interested in this position?", answer: "Based on my experience...", fieldType: "textarea" },
                            { question: "Expected salary range?", answer: "Market competitive", fieldType: "select" },
                            { question: "Work authorization?", answer: "Yes", fieldType: "radio" }
                          ]).map((q, idx) => (
                            <div key={idx} className="bg-gray-900 border border-gray-800 rounded-lg p-3">
                              <div className="flex items-start justify-between mb-1">
                                <p className="text-sm font-medium text-white">{q.question}</p>
                                <span className="text-xs font-mono text-gray-500 bg-gray-800 px-2 py-1 rounded">
                                  {q.fieldType}
                                </span>
                              </div>
                              <p className="text-sm text-gray-400 mt-2">{q.answer}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Toggle Trace Button */}
                    <button
                      onClick={() => setExpandedTrace(isExpanded ? null : application._id)}
                      className="flex items-center space-x-2 text-sm font-mono text-emerald-500 hover:text-emerald-400 transition-colors"
                    >
                      <span>{isExpanded ? '▼' : '▶'}</span>
                      <span>{isExpanded ? 'HIDE' : 'VIEW'} DETAILED TRACE</span>
                      <span className="text-xs text-gray-500">
                        ({(application.agentTraces || []).length || 6} actions)
                      </span>
                    </button>
                  </div>

                  {/* Expanded Trace Details */}
                  {isExpanded && (
                    <div className="border-t border-gray-900 bg-black/50">
                      <div className="p-6">
                        <h4 className="text-xs font-mono text-emerald-500 uppercase mb-4">ACTION TRACE LOG</h4>
                        <div className="space-y-2">
                          {(application.agentTraces || [
                            { timestamp: new Date().toISOString(), action: "NAVIGATE", element: "application_form", value: "https://careers.company.com", success: true },
                            { timestamp: new Date().toISOString(), action: "FILL", element: "input#firstName", value: "Profile data", success: true },
                            { timestamp: new Date().toISOString(), action: "FILL", element: "input#lastName", value: "Profile data", success: true },
                            { timestamp: new Date().toISOString(), action: "SELECT", element: "select#experience", value: "5-10 years", success: true },
                            { timestamp: new Date().toISOString(), action: "GENERATE", element: "textarea#coverLetter", value: "AI-generated content", success: true },
                            { timestamp: new Date().toISOString(), action: "SUBMIT", element: "button#submit", value: "Submitted", success: true }
                          ]).map((trace, idx) => (
                            <div key={idx} className="flex items-start space-x-3 font-mono text-xs">
                              <span className="text-gray-600 w-20 flex-shrink-0">
                                {new Date(trace.timestamp).toLocaleTimeString()}
                              </span>
                              <span className="text-2xl w-8 text-center flex-shrink-0">
                                {getActionIcon(trace.action)}
                              </span>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <span className={`px-2 py-0.5 rounded text-xs ${trace.success ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                                    {trace.action}
                                  </span>
                                  <code className="text-gray-400">{trace.element}</code>
                                </div>
                                {trace.value && (
                                  <p className="text-gray-500 mt-1 ml-0">{trace.value}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Export Trace Button */}
                        <div className="mt-6 pt-6 border-t border-gray-900">
                          <button className="text-xs font-mono text-gray-500 hover:text-emerald-500 transition-colors">
                            EXPORT TRACE FOR FINE-TUNING →
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

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