'use client';

import Image from 'next/image';
import { useJobStore } from '@/store/useJobStore';

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

export default function JobCard({ job }: { job: Job }) {
  const { addFilter } = useJobStore();

  const tags = [job.role, job.level, ...job.languages, ...job.tools];

  return (
    <div
      className={`relative bg-white dark:bg-v-dark-gray-cyan p-8 rounded-lg shadow-xl shadow-primary/10 flex flex-col lg:flex-row lg:items-center justify-between transition-all hover:scale-[1.01] border-l-4 ${
        job.featured ? 'border-primary' : 'border-transparent'
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
        <div className="absolute -top-6 lg:static">
          <Image
            src={`/${job.logo}`}
            alt={job.company}
            width={88}
            height={88}
            className="w-12 h-12 lg:w-[88px] lg:h-[88px]"
          />
        </div>

        <div className="flex flex-col gap-2 mt-4 lg:mt-0">
          <div className="flex items-center gap-4">
            <span className="text-primary font-bold">{job.company}</span>
            <div className="flex gap-2">
              {job.new && (
                <span className="bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase leading-none pt-[6px]">
                  New!
                </span>
              )}
              {job.featured && (
                <span className="bg-v-dark-gray-cyan dark:bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase leading-none pt-[6px]">
                  Featured
                </span>
              )}
            </div>
          </div>

          <h2 
            onClick={() => window.location.href = `/jobs/${job.id}`}
            className="text-v-dark-gray-cyan dark:text-bg-light font-bold text-lg hover:text-primary cursor-pointer transition-colors"
          >
            {job.position}
          </h2>

          <div className="flex items-center gap-2 text-dark-gray-cyan text-[13px]">
            <span>{job.postedAt}</span>
            <span>•</span>
            <span>{job.contract}</span>
            <span>•</span>
            <span>{job.location}</span>
          </div>
        </div>
      </div>

      <hr className="lg:hidden my-4 border-dark-gray-cyan/20" />

      <div className="flex flex-wrap gap-4 mt-2 lg:mt-0">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => addFilter(tag)}
            className="bg-filter-tablet dark:bg-dark-gray-cyan/20 text-primary dark:text-bg-light font-bold px-3 py-1 rounded hover:bg-primary hover:text-white transition-all text-sm"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
