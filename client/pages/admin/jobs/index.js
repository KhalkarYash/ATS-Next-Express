"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Layout from "@/components/layout/Layout"
import SearchBar from "@/components/ui/SearchBar"
import { Pagination } from "@/components/ui/Pagination"
import { fetchJobs, deleteJob } from "@/utils/api"
import { formatDate } from "@/utils/helpers"
import { AlertCircle, Edit, Trash2, Plus, Eye } from "lucide-react"

export default function AdminJobs() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pageQuery = searchParams.get('page')
  const search = searchParams.get('search')

  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(Number.parseInt(pageQuery) || 1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState(search || "")
  const [deleteLoading, setDeleteLoading] = useState(null)

  useEffect(() => {
    // Update URL with current search and pagination
    const query = new URLSearchParams()
    if (searchTerm) query.set('search', searchTerm)
    if (page > 1) query.set('page', page.toString())

    router.push(`/admin/jobs?${query.toString()}`)

    const loadJobs = async () => {
      try {
        setLoading(true)
        const response = await fetchJobs({
          page,
          search: searchTerm,
          admin: true, // Get all jobs for admin
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
  }, [page, searchTerm, router])

  const handleSearch = (term) => {
    setSearchTerm(term)
    setPage(1)
  }

  const handlePageChange = (newPage) => {
    setPage(newPage)
    window.scrollTo(0, 0)
  }

  const handleDeleteJob = async (jobId) => {
    if (!confirm("Are you sure you want to delete this job? This action cannot be undone.")) {
      return
    }

    try {
      setDeleteLoading(jobId)
      await deleteJob(jobId)

      // Remove the job from the list
      setJobs(jobs.filter((job) => job.id !== jobId))
    } catch (err) {
      setError("Failed to delete job. Please try again later.")
      console.error(err)
    } finally {
      setDeleteLoading(null)
    }
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Jobs</h1>
            <p className="mt-1 text-sm text-gray-500">Create, edit, and manage job listings</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link
              href="/admin/jobs/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Post New Job
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6">
          <SearchBar
            initialValue={searchTerm}
            onSearch={handleSearch}
            placeholder="Search jobs by title, company, or location"
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-10 bg-white shadow rounded-lg">
            <h3 className="mt-2 text-lg font-medium text-gray-900">No jobs found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? `No jobs matching "${searchTerm}" were found.` : "There are no jobs posted yet."}
            </p>
            <div className="mt-6">
              <Link
                href="/admin/jobs/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Post New Job
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Job Title
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Company
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Location
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Posted Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Applications
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{job.title}</div>
                      <div className="text-sm text-gray-500">{job.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{job.company}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{job.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(job.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.applications || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          job.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {job.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link href={`/jobs/${job.id}`} className="text-blue-600 hover:text-blue-900" title="View Job">
                          <Eye className="h-5 w-5" />
                        </Link>
                        <Link
                          href={`/admin/jobs/edit/${job.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit Job"
                        >
                          <Edit className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          disabled={deleteLoading === job.id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete Job"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && jobs.length > 0 && (
          <div className="mt-6">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
          </div>
        )}
      </div>
    </Layout>
  )
}
