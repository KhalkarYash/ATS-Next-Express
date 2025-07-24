"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Layout from "@/components/layout/Layout"
import ApplicationStatus from "@/components/applications/ApplicationStatus"
import PipelineHistory from "@/components/applications/PipelineHistory"
import { fetchApplicationById, withdrawApplication } from "@/utils/api"
import { isAuthenticated } from "@/utils/auth"
import { formatDate } from "@/utils/helpers"
import { AlertCircle, FileText, Calendar, Clock } from "lucide-react"

export default function ApplicationDetails() {
  const router = useRouter()
  const { id } = router.query || {}

  const [application, setApplication] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [withdrawing, setWithdrawing] = useState(false)

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      router.push("/login?redirect=/applications/" + id)
      return
    }

    if (!id) return

    const loadApplication = async () => {
      try {
        setLoading(true)
        const applicationData = await fetchApplicationById(id)
        setApplication(applicationData)
      } catch (err) {
        setError("Failed to load application details. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadApplication()
  }, [id, router])

  const handleWithdraw = async () => {
    if (!confirm("Are you sure you want to withdraw this application? This action cannot be undone.")) {
      return
    }

    try {
      setWithdrawing(true)
      await withdrawApplication(id)

      // Update the application status locally
      setApplication((prev) => ({
        ...prev,
        status: "withdrawn",
      }))
    } catch (err) {
      setError("Failed to withdraw application. Please try again later.")
      console.error(err)
    } finally {
      setWithdrawing(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    )
  }

  if (error || !application) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error || "Application not found"}</p>
              </div>
            </div>
          </div>
          <Link href="/applications" className="text-blue-600 hover:text-blue-800">
            ← Back to applications
          </Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link href="/applications" className="text-blue-600 hover:text-blue-800 inline-flex items-center mb-6">
          ← Back to applications
        </Link>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{application.job.title}</h1>
                <p className="mt-1 text-sm text-gray-500">
                  at {application.job.company} • {application.job.location}
                </p>
              </div>
              <ApplicationStatus status={application.status} className="mt-2 sm:mt-0" />
            </div>
          </div>

          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex flex-wrap gap-4">
              <span className="inline-flex items-center text-sm text-gray-500">
                <FileText className="h-4 w-4 mr-1" />
                Application #{application.id}
              </span>
              <span className="inline-flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                Applied on {formatDate(application.createdAt)}
              </span>
              <span className="inline-flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                Last updated {formatDate(application.updatedAt)}
              </span>
            </div>
          </div>

          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Application Details</h2>

            <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                <p className="mt-1 text-sm text-gray-900">{application.fullName}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="mt-1 text-sm text-gray-900">{application.email}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                <p className="mt-1 text-sm text-gray-900">{application.phone}</p>
              </div>

              {application.linkedIn && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">LinkedIn</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    <a
                      href={application.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {application.linkedIn}
                    </a>
                  </p>
                </div>
              )}

              {application.portfolio && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Portfolio/Website</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    <a
                      href={application.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {application.portfolio}
                    </a>
                  </p>
                </div>
              )}

              {application.referral && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Referral</h3>
                  <p className="mt-1 text-sm text-gray-900">{application.referral}</p>
                </div>
              )}
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-500">Cover Letter</h3>
              <div className="mt-1 text-sm text-gray-900 whitespace-pre-line">{application.coverLetter}</div>
            </div>

            {application.additionalInfo && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500">Additional Information</h3>
                <div className="mt-1 text-sm text-gray-900 whitespace-pre-line">{application.additionalInfo}</div>
              </div>
            )}

            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-500">Resume</h3>
              <div className="mt-1">
                <a
                  href={`/api/resumes/${application.resumeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  View Resume
                </a>
              </div>
            </div>
          </div>

          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Application Timeline</h2>
            <PipelineHistory applicationId={application.id} />
          </div>
        </div>

        {application.status !== "withdrawn" && (
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Withdraw Application</h2>
            <p className="text-gray-700 mb-4">
              If you wish to withdraw your application for this position, click the button below. This action cannot be
              undone.
            </p>
            <button
              onClick={handleWithdraw}
              disabled={withdrawing}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {withdrawing ? "Withdrawing..." : "Withdraw Application"}
            </button>
          </div>
        )}
      </div>
    </Layout>
  )
}
