"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Layout from "@/components/layout/Layout"
import { fetchJobById } from "@/utils/api"
import { isAuthenticated } from "@/utils/auth"
import { formatDate } from "@/utils/helpers"
import { Briefcase, MapPin, Calendar, Clock, Building, DollarSign } from "lucide-react"

export default function JobDetailsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return

    const loadJob = async () => {
      try {
        setLoading(true)
        const jobData = await fetchJobById(id)
        setJob(jobData)
      } catch (err) {
        setError("Failed to load job details. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadJob()
  }, [id])

  const handleApply = () => {
    if (!isAuthenticated()) {
      router.push(`/login?redirect=/applications/new?jobId=${id}`)
    } else {
      router.push(`/applications/new?jobId=${id}`)
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

  if (error || !job) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error || "Job not found"}</p>
              </div>
            </div>
          </div>
          <Link href="/jobs" className="text-blue-600 hover:text-blue-800">
            ← Back to jobs
          </Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link href="/jobs" className="text-blue-600 hover:text-blue-800 inline-flex items-center mb-6">
          ← Back to jobs
        </Link>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
            <div className="mt-2 flex flex-wrap gap-3">
              <span className="inline-flex items-center text-sm text-gray-500">
                <Building className="h-4 w-4 mr-1" />
                {job.company}
              </span>
              <span className="inline-flex items-center text-sm text-gray-500">
                <MapPin className="h-4 w-4 mr-1" />
                {job.location}
              </span>
              <span className="inline-flex items-center text-sm text-gray-500">
                <Briefcase className="h-4 w-4 mr-1" />
                {job.type}
              </span>
              <span className="inline-flex items-center text-sm text-gray-500">
                <DollarSign className="h-4 w-4 mr-1" />
                {job.salary || "Competitive"}
              </span>
              <span className="inline-flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                Posted {formatDate(job.createdAt)}
              </span>
              <span className="inline-flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                Apply by {formatDate(job.deadline)}
              </span>
            </div>
          </div>

          <div className="px-4 py-5 sm:px-6">
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">Job Description</h2>
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: job.description }}></div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">Requirements</h2>
              <ul className="list-disc pl-5 space-y-1">
                {job.requirements.map((req, index) => (
                  <li key={index} className="text-gray-700">
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">Responsibilities</h2>
              <ul className="list-disc pl-5 space-y-1">
                {job.responsibilities.map((resp, index) => (
                  <li key={index} className="text-gray-700">
                    {resp}
                  </li>
                ))}
              </ul>
            </div>

            {job.benefits && job.benefits.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-2">Benefits</h2>
                <ul className="list-disc pl-5 space-y-1">
                  {job.benefits.map((benefit, index) => (
                    <li key={index} className="text-gray-700">
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Ready to Apply?</h2>
          <p className="text-gray-700 mb-4">
            Submit your application now and take the next step in your career journey.
          </p>
          <button
            onClick={handleApply}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Apply for this position
          </button>
        </div>
      </div>
    </Layout>
  )
}
