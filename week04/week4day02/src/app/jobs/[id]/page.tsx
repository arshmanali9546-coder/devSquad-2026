'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import { ChevronLeft } from 'lucide-react';

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

export default function JobDetails() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJob() {
      try {
        const response = await fetch('/api/jobs');
        const data = await response.json();
        const foundJob = data.find((j: Job) => j.id === Number(params.id));
        setJob(foundJob || null);
      } catch (error) {
        console.error('Error fetching job details:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchJob();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-light dark:bg-v-dark-gray-cyan/10">
        <Header />
        <div className="container-custom py-20 flex justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-bg-light dark:bg-v-dark-gray-cyan/10">
        <Header />
        <div className="container-custom py-20 text-center">
          <h1 className="text-2xl font-bold text-v-dark-gray-cyan">Job not found</h1>
          <button
            onClick={() => router.push('/')}
            className="mt-4 text-primary font-bold hover:underline"
          >
            Go back to listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-light dark:bg-v-dark-gray-cyan/10 transition-colors duration-300">
      <Header />
      
      <main className="container-custom py-10">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-primary font-bold hover:bg-primary/10 px-4 py-2 rounded-lg transition-all mb-8"
        >
          <ChevronLeft size={20} />
          Back to Listings
        </button>

        <div className="bg-white dark:bg-v-dark-gray-cyan rounded-lg shadow-2xl overflow-hidden">
          <div className="p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row gap-8 lg:items-center mb-10">
              <Image
                src={`/${job.logo}`}
                alt={job.company}
                width={120}
                height={120}
                className="w-20 h-20 lg:w-24 lg:h-24"
              />
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-primary font-bold text-lg">{job.company}</span>
                  <div className="flex gap-2">
                    {job.new && (
                      <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                        New!
                      </span>
                    )}
                    {job.featured && (
                      <span className="bg-v-dark-gray-cyan dark:bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                        Featured
                      </span>
                    )}
                  </div>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-v-dark-gray-cyan dark:text-bg-light mb-4 text-pretty">
                  {job.position}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-dark-gray-cyan font-medium">
                  <span>{job.postedAt}</span>
                  <span>•</span>
                  <span>{job.contract}</span>
                  <span>•</span>
                  <span>{job.location}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-6">
                <section>
                  <h2 className="text-xl font-bold text-v-dark-gray-cyan dark:text-bg-light mb-4">Job Description</h2>
                  <p className="text-dark-gray-cyan leading-relaxed">
                    We are looking for a talented {job.position} to join our team at {job.company}. 
                    You will be working on exciting projects in a {job.contract} capacity, helping us 
                    deliver world-class solutions. This position is based in {job.location}.
                  </p>
                </section>
                
                <section>
                  <h3 className="text-xl font-bold text-v-dark-gray-cyan dark:text-bg-light mb-4">Requirements</h3>
                  <ul className="list-disc list-inside text-dark-gray-cyan space-y-2">
                    <li>Experience with {job.role} technologies</li>
                    <li>Ability to work at a {job.level} level</li>
                    {job.languages.map(lang => <li key={lang}>Proficiency in {lang}</li>)}
                    {job.tools.map(tool => <li key={tool}>Experience with {tool}</li>)}
                  </ul>
                </section>
              </div>

              <div className="space-y-8">
                <div className="bg-bg-light dark:bg-v-dark-gray-cyan/20 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-v-dark-gray-cyan dark:text-bg-light mb-4">Role Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-dark-gray-cyan">Role:</span>
                      <span className="font-bold text-primary">{job.role}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark-gray-cyan">Level:</span>
                      <span className="font-bold text-primary">{job.level}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <button className="bg-primary text-white font-bold py-4 rounded-xl hover:bg-v-dark-gray-cyan transition-all shadow-lg shadow-primary/30">
                    Apply Now
                  </button>
                  <button className="border-2 border-primary text-primary font-bold py-4 rounded-xl hover:bg-primary/10 transition-all">
                    Save for Later
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
