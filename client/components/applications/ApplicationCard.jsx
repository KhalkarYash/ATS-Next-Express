import Link from "next/link"
import { formatDate, getStatusColor } from "@/utils/helpers"
import { Calendar, Clock } from "lucide-react"

export default function ApplicationCard({ application }) {
  const statusClass = getStatusColor(application.status)

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
      <div className="p-5">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              <Link href={`/jobs/${application.job.id}`} className="hover:text-blue-600">
                {application.job.title}
              </Link>
            </h3>
            <p className="text-sm text-gray-500 mb-2">{application.job.company}</p>
          </div>
          <div className="mt-2 sm:mt-0">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass}`}>
              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
            </span>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-500">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
            Applied on {formatDate(application.createdAt)}
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
            Last updated {formatDate(application.updatedAt)}
          </div>
        </div>

        {application.lastNote && (
          <div className="mt-3 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600 italic">"{application.lastNote}"</p>
          </div>
        )}
      </div>

      <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex justify-end">
        <Link
          href={`/applications/${application.id}`}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          View Application
        </Link>
      </div>
    </div>
  )
}
