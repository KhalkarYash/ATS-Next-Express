"use client"

import { useState } from "react"
import { updateApplicationStatus } from "@/utils/api"
import { AlertCircle, CheckCircle } from "lucide-react"

export default function PipelineManager({ applicationId, currentStatus, onStatusUpdate }) {
  const [status, setStatus] = useState(currentStatus)
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "reviewing", label: "Reviewing" },
    { value: "interview", label: "Interview" },
    { value: "offer", label: "Offer" },
    { value: "rejected", label: "Rejected" },
    { value: "withdrawn", label: "Withdrawn" },
  ]

  const handleStatusChange = (e) => {
    setStatus(e.target.value)
  }

  const handleNotesChange = (e) => {
    setNotes(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setLoading(true)

    try {
      const updatedApplication = await updateApplicationStatus(applicationId, status, notes)

      setSuccess(true)
      setNotes("")

      // Call the callback to update the parent component
      if (onStatusUpdate) {
        onStatusUpdate(updatedApplication)
      }

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    } catch (err) {
      setError(err.message || "Failed to update application status. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
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

      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">Application status updated successfully!</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Update Status
          </label>
          <select
            id="status"
            name="status"
            value={status}
            onChange={handleStatusChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes (optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            value={notes}
            onChange={handleNotesChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Add notes about this status change (e.g., interview feedback, reason for rejection, etc.)"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || status === currentStatus}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Updating..." : "Update Status"}
          </button>
        </div>
      </form>

      <div className="mt-6 bg-gray-50 p-4 rounded-md">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Status Descriptions</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>
            <strong>Pending:</strong> Application received but not yet reviewed
          </li>
          <li>
            <strong>Reviewing:</strong> Application is being reviewed by the hiring team
          </li>
          <li>
            <strong>Interview:</strong> Candidate has been selected for an interview
          </li>
          <li>
            <strong>Offer:</strong> A job offer has been extended to the candidate
          </li>
          <li>
            <strong>Rejected:</strong> Application has been declined
          </li>
          <li>
            <strong>Withdrawn:</strong> Candidate has withdrawn their application
          </li>
        </ul>
      </div>
    </div>
  )
}
