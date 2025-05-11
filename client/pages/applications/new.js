"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Layout from "@/components/layout/Layout"
import ResumeUpload from "@/components/resume/ResumeUpload"
import { fetchJobById, submitApplication } from "@/utils/api"
import { isAuthenticated } from "@/utils/auth"
import { AlertCircle } from "lucide-react"

export default function NewApplication() {
  const router = useRouter()
  const { jobId } = router.query

  const [job, setJob] = useState(null)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    coverLetter: "",
    resumeId: null,
    linkedIn: "",
    portfolio: "",
    referral: "",
    additionalInfo: "",
  })

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      router.push("/login?redirect=/applications/new" + (jobId ? `?jobId=${jobId}` : ""))
      return
    }

    if (!jobId) {
      setError("No job selected. Please select a job to apply for.")
      setLoading(false)
      return
    }

    const loadJob = async () => {
      try {
        setLoading(true)
        const jobData = await fetchJobById(jobId)
        setJob(jobData)

        // Pre-fill form with user data if available
        const userData = JSON.parse(localStorage.getItem("userData") || "{}")
        setFormData((prev) => ({
          ...prev,
          fullName: userData.name || "",
          email: userData.email || "",
        }))
      } catch (err) {
        setError("Failed to load job details. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadJob()
  }, [jobId, router])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleResumeUpload = (resumeId) => {
    setFormData((prev) => ({
      ...prev,
      resumeId,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.resumeId) {
      setError("Please upload your resume before submitting your application.")
      return
    }

    setError(null)
    setSubmitting(true)

    try {
      await submitApplication({
        jobId,
        ...formData,
      })

      setSuccess(true)

      // Redirect to applications list after a short delay
      setTimeout(() => {
        router.push("/applications")
      }, 3000)
    } catch (err) {
      setError(err.message || "Failed to submit application. Please try again.")
    } finally {
      setSubmitting(false)
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

  if (success) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  Your application has been submitted successfully! You will be redirected to your applications list.
                </p>
              </div>
            </div>
          </div>
          <Link href="/applications" className="text-blue-600 hover:text-blue-800">
            View all my applications
          </Link>
        </div>
      </Layout>
    )
  }

  if (error && !job) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
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
          <Link href="/jobs" className="text-blue-600 hover:text-blue-800">
            Browse jobs
          </Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link href={`/jobs/${jobId}`} className="text-blue-600 hover:text-blue-800 inline-flex items-center mb-6">
          ← Back to job details
        </Link>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Apply for {job.title}</h1>
            <p className="mt-1 text-sm text-gray-500">
              at {job.company} • {job.location}
            </p>
          </div>

          {error && (
            <div className="px-4 py-3 bg-red-50 border-b border-red-200">
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

          <form onSubmit={handleSubmit} className="px-4 py-5 sm:px-6 space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  id="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="linkedIn" className="block text-sm font-medium text-gray-700">
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  name="linkedIn"
                  id="linkedIn"
                  value={formData.linkedIn}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>

              <div>
                <label htmlFor="portfolio" className="block text-sm font-medium text-gray-700">
                  Portfolio/Website
                </label>
                <input
                  type="url"
                  name="portfolio"
                  id="portfolio"
                  value={formData.portfolio}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="https://yourportfolio.com"
                />
              </div>

              <div>
                <label htmlFor="referral" className="block text-sm font-medium text-gray-700">
                  Referral (if any)
                </label>
                <input
                  type="text"
                  name="referral"
                  id="referral"
                  value={formData.referral}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Name of person who referred you"
                />
              </div>
            </div>

            <div>
              <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700">
                Cover Letter *
              </label>
              <div className="mt-1">
                <textarea
                  id="coverLetter"
                  name="coverLetter"
                  rows={4}
                  required
                  value={formData.coverLetter}
                  onChange={handleChange}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Tell us why you're a great fit for this role..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Resume/CV *</label>
              <ResumeUpload onUploadSuccess={handleResumeUpload} />
              {formData.resumeId && <p className="mt-2 text-sm text-green-600">Resume uploaded successfully!</p>}
            </div>

            <div>
              <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700">
                Additional Information
              </label>
              <div className="mt-1">
                <textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  rows={3}
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Any additional information you'd like to share..."
                />
              </div>
            </div>

            <div className="pt-5">
              <div className="flex justify-end">
                <Link
                  href={`/jobs/${jobId}`}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={submitting || !formData.resumeId}
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}
