"use client"

import { useEffect, useState } from "react"
import { fetchPipelineHistory } from "@/utils/api"
import { formatDateTime } from "@/utils/helpers"
import { CheckCircle, AlertCircle } from "lucide-react"

export default function PipelineHistory({ applicationId }) {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true)
        const data = await fetchPipelineHistory(applicationId)
        setHistory(data)
      } catch (err) {
        setError("Failed to load application history. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadHistory()
  }, [applicationId])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
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
    )
  }

  if (history.length === 0) {
    return <div className="text-center py-6 text-gray-500">No history available for this application.</div>
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {history.map((event, eventIdx) => (
          <li key={event.id}>
            <div className="relative pb-8">
              {eventIdx !== history.length - 1 ? (
                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                    <CheckCircle className="h-5 w-5 text-white" aria-hidden="true" />
                  </span>
                </div>
                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      Status changed to <span className="font-medium text-gray-900">{event.status}</span>
                      {event.notes && <span className="ml-2 font-medium text-gray-700">- "{event.notes}"</span>}
                    </p>
                  </div>
                  <div className="text-right text-sm whitespace-nowrap text-gray-500">
                    {formatDateTime(event.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
