import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Job } from '../types';

interface JobCardProps {
  job: Job;
  applied?: boolean;
}

const JobCard: React.FC<JobCardProps> = ({ job, applied = false }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isApplying, setIsApplying] = useState(false);
  const createApplication = useMutation(api.applications.createApplication);

  const handleApply = async () => {
    if (!user) {
      showToast('Please upload your profile first', 'error');
      return;
    }

    setIsApplying(true);
    showToast('🤖 AI Agent is starting the application process...', 'info');

    try {
      // Simulate 3-second loading for demo
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Create a record in Convex for tracking (this will generate the detailed agent trace)
      await createApplication({
        candidateId: user._id,
        jobId: job._id,
        coverLetter: `Applied via Job Use AI Agent to ${job.title} position at ${job.company}.`,
      });

      showToast('✅ Application submitted successfully!', 'success');

      // Show additional success message after a delay
      setTimeout(() => {
        showToast('🎯 AI Agent completed all form fields. Check Agent Trace for details!', 'success');
      }, 1500);

      /* TEMPORARILY DISABLED FOR DEMO - Uncomment to re-enable API calls
      // Check if this is the Rochester Regional Health job
      if (job.company.includes('Rochester Regional Health')) {
        // Call the FastAPI backend - simple POST without body
        const response = await fetch('http://localhost:8000/apply/rochester-regional-health/test', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors',
        });

        if (!response.ok) {
          throw new Error(`Application failed: ${response.statusText}`);
        }

        const result = await response.json();
      }
      */

    } catch (error) {
      console.error('Application error:', error);
      if (error instanceof Error && error.message.includes('already applied')) {
        showToast('You have already applied for this position', 'error');
      } else {
        showToast('Failed to submit application. Please try again.', 'error');
      }
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="group relative bg-gray-950 border border-gray-900 rounded-lg p-6 hover:border-gray-800 transition-all hover:transform hover:scale-[1.02]">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-white mb-1">{job.title}</h3>
          <p className="text-lg text-emerald-500 font-medium">{job.company}</p>
        </div>
        {job.status === 'active' && (
          <span className="px-3 py-1 text-xs font-mono text-green-400 bg-green-400/10 border border-green-400/20 rounded-full">
            ACTIVE
          </span>
        )}
      </div>

      <div className="space-y-2 mb-4">
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

      <p className="text-gray-500 text-sm mb-4 line-clamp-2">
        {job.description}
      </p>

      <div className="flex justify-between items-center pt-4 border-t border-gray-900">
        <span className="text-xs text-gray-600 font-mono">
          {new Date(job.postedDate).toLocaleDateString()}
        </span>
        {applied ? (
          <span className="px-4 py-2 text-sm font-medium text-green-400 bg-green-400/10 border border-green-400/20 rounded-full">
            Applied
          </span>
        ) : (
          <button
            onClick={handleApply}
            className="px-5 py-2 text-sm font-medium text-black bg-emerald-500 rounded-full hover:bg-emerald-400 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={job.status !== 'active' || isApplying}
          >
            {isApplying ? 'Applying...' : 'Apply with Job Use'}
          </button>
        )}
      </div>
    </div>
  );
};

export default JobCard;