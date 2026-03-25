'use client';

import { useEffect, useState } from 'react';
import { useJobStore } from '@/store/useJobStore';
import JobCard from './JobCard';

interface Job {
  id: number;
  company: string;
  logo: string;
  new: boolean;
  featured: boolean;
  position: string;
  role: string;
  level: string;
  postedAt: string;
  contract: string;
  location: string;
  languages: string[];
  tools: string[];
}

export default function JobBoard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const { filters } = useJobStore();

  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await fetch('/api/jobs');
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    if (filters.length === 0) return true;
    const tags = [job.role, job.level, ...job.languages, ...job.tools];
    return filters.every((filter) => tags.includes(filter));
  });

  if (loading) {
    return (
      <div className="container-custom py-20 flex justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-primary font-bold animate-pulse">Loading amazing jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="container-custom py-14 lg:py-20 flex flex-col gap-14 lg:gap-6 mt-10 lg:mt-0">
      {filteredJobs.length > 0 ? (
        filteredJobs.map((job) => <JobCard key={job.id} job={job} />)
      ) : (
        <div className="bg-white dark:bg-v-dark-gray-cyan p-12 rounded-lg text-center shadow-lg">
          <p className="text-dark-gray-cyan dark:text-bg-light text-xl font-bold">
            No jobs found matching these filters. Try clearing some.
          </p>
        </div>
      )}
    </main>
  );
}
