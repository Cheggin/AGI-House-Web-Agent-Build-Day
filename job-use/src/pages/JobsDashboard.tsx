import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import JobCard from '../components/JobCard';
import { useAuth } from '../contexts/AuthContext';
import { Id } from '../../convex/_generated/dataModel';

const JobsDashboard: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [appliedJobs, setAppliedJobs] = useState<Set<Id<"jobs">>>(new Set());

  const jobs = useQuery(api.jobs.listJobs, { status: 'active' });
  const applications = useQuery(api.applications.listApplications, {
    candidateId: user?._id,
  });
  const seedJobs = useMutation(api.jobs.seedJobs);

  useEffect(() => {
    if (jobs && jobs.length === 0) {
      void seedJobs({});
    }
  }, [jobs, seedJobs]);

  useEffect(() => {
    if (applications) {
      const jobIds = new Set(applications.map(app => app.jobId));
      setAppliedJobs(jobIds);
    }
  }, [applications]);

  const filteredJobs = jobs?.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !filterLocation || job.location.toLowerCase().includes(filterLocation.toLowerCase());
    return matchesSearch && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-black text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <span className="inline-block px-3 py-1 text-xs font-mono text-emerald-500 border border-emerald-500/30 rounded-full bg-emerald-500/10">
              LIVE
            </span>
            <span className="text-xs font-mono text-gray-500">
              {filteredJobs ? `${filteredJobs.length} OPPORTUNITIES` : 'LOADING...'}
            </span>
          </div>
          <h1 className="text-4xl font-bold">Job Opportunities</h1>
        </div>

        <div className="bg-gray-950 border border-gray-900 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="search" className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider">
                Search Query
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title, company, or keywords..."
                  className="w-full pl-10 pr-4 py-3 bg-black border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
                <svg
                  className="absolute left-3 top-3.5 h-5 w-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <div>
              <label htmlFor="location" className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider">
                Location Filter
              </label>
              <input
                type="text"
                id="location"
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                placeholder="Filter by location..."
                className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        {!user && (
          <div className="bg-gray-950 border border-emerald-500/30 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <svg className="h-6 w-6 text-emerald-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-white font-medium">Authentication Required</p>
                <p className="text-gray-500 text-sm">
                  Upload your profile to start applying to positions
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs?.map(job => (
            <JobCard
              key={job._id}
              job={job}
              applied={appliedJobs.has(job._id)}
            />
          ))}
        </div>

        {filteredJobs?.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-block p-8 bg-gray-950 border border-gray-900 rounded-lg">
              <svg className="mx-auto h-12 w-12 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg text-white font-medium mb-2">No matches found</p>
              <p className="text-sm text-gray-500">Try adjusting your search parameters</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsDashboard;