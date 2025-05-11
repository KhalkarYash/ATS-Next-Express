"use client"

import { useState, useEffect } from "react"
import { Briefcase, Clock, CheckCircle, XCircle } from "lucide-react"

export default function DashboardStats({ applications }) {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    interviewing: 0,
    offers: 0,
    rejected: 0,
  })

  useEffect(() => {
    if (!applications || !applications.length) return

    // Calculate stats from applications
    const newStats = {
      total: applications.length,
      pending: applications.filter((app) => app.status === "pending" || app.status === "reviewing").length,
      interviewing: applications.filter((app) => app.status === "interview").length,
      offers: applications.filter((app) => app.status === "offer").length,
      rejected: applications.filter((app) => app.status === "rejected" || app.status === "withdrawn").length,
    }

    setStats(newStats)
  }, [applications])

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Briefcase className="h-6 w-6 text-gray-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Applications</dt>
                <dd>
                  <div className="text-lg font-medium text-gray-900">{stats.total}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-6 w-6 text-yellow-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Pending/Reviewing</dt>
                <dd>
                  <div className="text-lg font-medium text-gray-900">{stats.pending}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-6 w-6 text-green-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Interviews/Offers</dt>
                <dd>
                  <div className="text-lg font-medium text-gray-900">{stats.interviewing + stats.offers}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <XCircle className="h-6 w-6 text-red-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Rejected/Withdrawn</dt>
                <dd>
                  <div className="text-lg font-medium text-gray-900">{stats.rejected}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
