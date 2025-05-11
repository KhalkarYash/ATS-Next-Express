"use client";

import dynamic from 'next/dynamic';
import { Suspense, useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import Layout from "../components/layout/Layout";
import LoadingSpinner from "../components/ui/loading-spinner";
import { fetchJobs } from "../utils/api";
import { isAuthenticated } from "../utils/auth";

// Dynamic imports for optimized loading
const JobCard = dynamic(() => import("../components/jobs/JobCard"), {
  loading: () => <LoadingSpinner />
});

const SearchBar = dynamic(() => import("../components/ui/SearchBar"), {
  ssr: false
});

const Pagination = dynamic(() => import("../components/ui/pagination"), {
  loading: () => <div className="h-10 animate-pulse bg-gray-100 rounded" />
});

export default function Home() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    department: "",
    type: "",
  });

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);
        const response = await fetchJobs({
          page,
          search: searchTerm,
          ...filters,
        });
        setJobs(response.jobs);
        setTotalPages(response.totalPages);
      } catch (err) {
        setError("Failed to load jobs. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [page, searchTerm, filters]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setPage(1);
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Find Your Dream Job
          </h1>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
            Browse through hundreds of opportunities and take the next step in
            your career
          </p>
        </div>

        <div className="mb-8">
          <Suspense fallback={<LoadingSpinner />}>
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search for jobs by title, skills, or keywords"
            />
          </Suspense>

          <div className="mt-4 flex flex-wrap gap-2">
            <select
              className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.location}
              onChange={(e) => handleFilterChange({ location: e.target.value })}
            >
              <option value="">All Locations</option>
              <option value="remote">Remote</option>
              <option value="onsite">Onsite</option>
              <option value="hybrid">Hybrid</option>
            </select>

            <select
              className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.department}
              onChange={(e) =>
                handleFilterChange({ department: e.target.value })
              }
            >
              <option value="">All Departments</option>
              <option value="engineering">Engineering</option>
              <option value="design">Design</option>
              <option value="marketing">Marketing</option>
              <option value="sales">Sales</option>
              <option value="hr">HR</option>
            </select>

            <select
              className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.type}
              onChange={(e) => handleFilterChange({ type: e.target.value })}
            >
              <option value="">All Job Types</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No jobs found matching your criteria. Try adjusting your filters.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <Suspense key={job.id} fallback={<div className="h-64 animate-pulse bg-gray-100 rounded-lg" />}>
                <JobCard job={job} />
              </Suspense>
            ))}
          </div>
        )}

        {!loading && jobs.length > 0 && (
          <div className="mt-10">
            <Suspense fallback={<div className="h-10 animate-pulse bg-gray-100 rounded" />}>
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </Suspense>
          </div>
        )}

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Are you an employer?
          </h2>
          <p className="mt-2 text-gray-500">
            Post a job and find the perfect candidate
          </p>
          <button
            onClick={() => {
              if (isAuthenticated()) {
                router.push("/admin/jobs/new");
              } else {
                router.push("/login?redirect=/admin/jobs/new");
              }
            }}
            className="mt-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Post a Job
          </button>
        </div>
      </div>
    </Layout>
  );
}
