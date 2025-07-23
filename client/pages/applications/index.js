"use client"

import React from 'react';
import withAuth from '../../utils/withAuth';
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation"
import Link from "next/link"
import Layout from "@/components/layout/Layout"
import ApplicationCard from "@/components/applications/ApplicationCard"
import Pagination from "@/components/ui/Pagination"
import { fetchUserApplications } from "@/utils/api"
import { AlertCircle } from "lucide-react"

function ApplicationsPage() {
  const router = useRouter()
  const { page: pageQuery, status } = router.query

  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(Number.parseInt(pageQuery) || 1)
  const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState(status || "")

  useEffect(() => {
    // Update URL with current filters and pagination
    const query = {
      ...(statusFilter && { status: statusFilter }),
      ...(page > 1 && { page }),
    }

    router.push(
      {
        pathname: "/applications",
        query,
      },
      undefined,
      { shallow: true },
    )

    const loadApplications = async () => {
      try {
        setLoading(true)
        const response = await fetchUserApplications({
          page,
          status: statusFilter,
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
  }, [page, statusFilter, router])

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value)
    setPage(1)
  }

  const handlePageChange = (newPage) => {
    setPage(newPage)
    window.scrollTo(0, 0)
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
            <p className="mt-1 text-sm text-gray-500">Track the status of your job applications</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link
              href="/jobs"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Browse Jobs
            </Link>
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="status-filter" className="sr-only">
            Filter by status
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="block w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Applications</option>
            <option value="pending">Pending</option>
            <option value="reviewing">Reviewing</option>
            <option value="interview">Interview</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
            <option value="withdrawn">Withdrawn</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
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
        ) : applications.length === 0 ? (
          <div className="text-center py-10">
            <h3 className="mt-2 text-lg font-medium text-gray-900">No applications found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {statusFilter
                ? `You don't have any applications with "${statusFilter}" status.`
                : "You haven't applied to any jobs yet."}
            </p>
            <div className="mt-6">
              <Link
                href="/jobs"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Find Jobs to Apply
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </div>
        )}

        {!loading && applications.length > 0 && (
          <div className="mt-10">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
          </div>
        )}
      </div>
    </Layout>
  )
}

export default withAuth(ApplicationsPage);
