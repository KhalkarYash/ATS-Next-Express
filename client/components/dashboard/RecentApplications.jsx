import Link from "next/link"
import { formatDate, getStatusColor } from "@/utils/helpers"

export default function RecentApplications({ applications }) {
  // Sort applications by date (newest first)
  const sortedApplications = [...(applications || [])]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5) // Show only the 5 most recent

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Applications</h3>
        <p className="mt-1 text-sm text-gray-500">Your most recent job applications and their status</p>
      </div>

      {sortedApplications.length === 0 ? (
        <div className="px-4 py-5 sm:p-6 text-center">
          <p className="text-gray-500">You haven't applied to any jobs yet.</p>
          <div className="mt-4">
            <Link
              href="/jobs"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Browse Jobs
            </Link>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {sortedApplications.map((application) => {
              const statusClass = getStatusColor(application.status)

              return (
                <li key={application.id}>
                  <Link href={`/applications/${application.id}`} className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="truncate">
                          <div className="flex text-sm">
                            <p className="font-medium text-blue-600 truncate">{application.job.title}</p>
                            <p className="ml-1 flex-shrink-0 font-normal text-gray-500">at {application.job.company}</p>
                          </div>
                          <div className="mt-2 flex">
                            <div className="flex items-center text-sm text-gray-500">
                              <p>
                                Applied on{" "}
                                <time dateTime={application.createdAt}>{formatDate(application.createdAt)}</time>
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}`}
                          >
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>

          <div className="bg-gray-50 px-4 py-4 sm:px-6 border-t border-gray-200">
            <div className="text-sm">
              <Link href="/applications" className="font-medium text-blue-600 hover:text-blue-500">
                View all applications<span aria-hidden="true"> &rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
