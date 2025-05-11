"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Layout from "@/components/layout/Layout"
import JobCard from "@/components/jobs/JobCard"
import SearchBar from "@/components/ui/SearchBar"
import Pagination from "@/components/ui/Pagination"
import { fetchJobs } from "@/utils/api"
import { isAuthenticated } from "@/utils/auth"

export default function Jobs() {
  const router = useRouter()
  const { search, location, department, type, page: pageQuery } = router.query

  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(Number.parseInt(pageQuery) || 1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState({
    search: search || "",
    location: location || "",
    department: department || "",
    type: type || "",
  })

  useEffect(() => {
    // Update URL with current filters and pagination
    const query = {
      ...(filters.search && { search: filters.search }),
      ...(filters.location && { location: filters.location }),
      ...(filters.department && { department: filters.department }),
      ...(filters.type && { type: filters.type }),
      ...(page > 1 && { page }),
    }

    router.push(
      {
        pathname: "/jobs",
        query,
      },
      undefined,
      { shallow: true },
    )

    const loadJobs = async () => {
      try {
        setLoading(true)
        const response = await fetchJobs({
          page,
          search: filters.search,
          location: filters.location,
          department: filters.department,
          type: filters.type,
        })
        setJobs(response.jobs)
        setTotalPages(response.totalPages)
      } catch (err) {
        setError("Failed to load jobs. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadJobs()
  }, [page, filters, router])

  const handleSearch = (term) => {
    setFilters((prev) => ({ ...prev, search: term }))
    setPage(1)
  }

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }))
    setPage(1)
  }

  const handlePageChange = (newPage) => {
    setPage(newPage)
    window.scrollTo(0, 0)
  }

  const handleApply = (jobId) => {
    if (!isAuthenticated()) {
      router.push(`/login?redirect=/jobs/${jobId}`);
      return;
    }
    router.push(`/jobs/${jobId}/apply`);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Browse Jobs</h1>
          <p className="mt-1 text-sm text-gray-500">Find the perfect role for your next career move</p>
        </div>

        <div className="mb-8">
          <SearchBar
            initialValue={filters.search}
            onSearch={handleSearch}
            placeholder="Search for jobs by title, skills, or keywords"
          />

          <div className="mt-4 flex flex-wrap gap-2">
            <select
              className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.location}
              onChange={(e) => handleFilterChange("location", e.target.value)}
            >
              <option value="">All Locations</option>
              <option value="remote">Remote</option>
              <option value="onsite">Onsite</option>
              <option value="hybrid">Hybrid</option>
            </select>

            <select
              className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.department}
              onChange={(e) => handleFilterChange("department", e.target.value)}
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
              onChange={(e) => handleFilterChange("type", e.target.value)}
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
              <JobCard 
                key={job.id} 
                job={job} 
                onApply={() => handleApply(job.id)}
                isAuthenticated={isAuthenticated()}
              />
            ))}
          </div>
        )}

        {!loading && jobs.length > 0 && (
          <div className="mt-10">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
          </div>
        )}
      </div>
    </Layout>
  )
}
