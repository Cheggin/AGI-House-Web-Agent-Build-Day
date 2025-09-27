import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Job } from '../types';

interface JobCardProps {
  job: Job;
  applied?: boolean;
}

const JobCard: React.FC<JobCardProps> = ({ job, applied = false }) => {
  const navigate = useNavigate();

  const handleApply = () => {
    void navigate(`/apply/${job._id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
          <p className="text-lg text-blue-600 font-medium">{job.company}</p>
        </div>
        {job.status === 'active' && (
          <span className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
            Active
          </span>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-600">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm">{job.location}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium">{job.salary}</span>
        </div>
      </div>

      <p className="text-gray-700 text-sm mb-4 line-clamp-2">
        {job.description}
      </p>

      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500">
          Posted {new Date(job.postedDate).toLocaleDateString()}
        </span>
        {applied ? (
          <span className="px-4 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-lg">
            Applied
          </span>
        ) : (
          <button
            onClick={handleApply}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            disabled={job.status !== 'active'}
          >
            Apply Now
          </button>
        )}
      </div>
    </div>
  );
};

export default JobCard;