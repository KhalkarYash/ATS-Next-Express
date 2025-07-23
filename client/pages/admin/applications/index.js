"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Layout from "@/components/layout/Layout"
import SearchBar from "@/components/ui/SearchBar"
import Pagination from "@/components/ui/Pagination"
import { fetchAllApplications } from "@/utils/api"
import { formatDate, getStatusColor } from "@/utils/helpers"
import { AlertCircle } from "lucide-react"

export default function AdminApplications() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pageQuery = searchParams.get('page')
  const status = searchParams.get('status')
  const jobId = searchParams.get('jobId')
  const search = searchParams.get('search')

  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(Number.parseInt(pageQuery) || 1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState({
    status: status || "",
    jobId: jobId || "",
    search: search || "",
  })

  useEffect(() => {
    // Update URL with current filters and pagination
    const query = new URLSearchParams()
    if (filters.status) query.set('status', filters.status)
    if (filters.jobId) query.set('jobId', filters.jobId)
    if (filters.search) query.set('search', filters.search)
    if (page > 1) query.set('page', page.toString())

    router.push(`/admin/applications?${query.toString()}`)

    const loadApplications = async () => {
      try {
        setLoading(true)
        const response = await fetchAllApplications({
          page,
          ...filters,
        })
        setApplications(response.applications)
        setTotalPages(response.totalPages)
      } catch (err) {
        setError("Failed to load applications. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadApplications()
  }, [page, filters, router])

  const handleSearch = (term) => {
    setFilters((prev) => ({ ...prev, search: term }))
    setPage(1)
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
    setPage(1)
  }

  const handlePageChange = (newPage) => {
    setPage(newPage)
    window.scrollTo(0, 0)
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Applications Management</h1>
          <p className="mt-1 text-sm text-gray-500">Review and manage job applications</p>
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

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="sm:flex-1">
            <SearchBar
              initialValue={filters.search}
              onSearch={handleSearch}
              placeholder="Search by applicant name or email"
            />
          </div>
          <div>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="reviewing">Reviewing</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="rejected">Rejected</option>
              <option value="withdrawn">Withdrawn</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-10 bg-white shadow rounded-lg">
            <h3 className="mt-2 text-lg font-medium text-gray-900">No applications found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filters.status || filters.search
                ? `No applications matching your filters were found.`
                : "There are no applications in the system yet."}
            </p>
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
                    Applicant
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Job
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Applied Date
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
                {applications.map((application) => {
                  const statusClass = getStatusColor(application.status)

                  return (
                    <tr key={application.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{application.fullName}</div>
                            <div className="text-sm text-gray-500">{application.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{application.job.title}</div>
                        <div className="text-sm text-gray-500">{application.job.company}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(application.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}`}
                        >
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/admin/applications/${application.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Review
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {!loading && applications.length > 0 && (
          <div className="mt-6">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
          </div>
        )}
      </div>
    </Layout>
  )
}
