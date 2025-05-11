import Link from "next/link"
import { truncateText } from "@/utils/helpers"

export default function JobsOverview({ jobs }) {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Recommended Jobs</h3>
        <p className="mt-1 text-sm text-gray-500">Jobs that match your profile and skills</p>
      </div>

      {jobs && jobs.length > 0 ? (
        <div className="overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {jobs.map((job) => (
              <li key={job.id}>
                <Link href={`/jobs/${job.id}`} className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex flex-col">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium text-blue-600 truncate">{job.title}</p>
                        <p className="ml-2 text-sm text-gray-500">{job.location}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{job.company}</p>
                      <p className="mt-2 text-sm text-gray-500">{truncateText(job.description, 100)}</p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <div className="bg-gray-50 px-4 py-4 sm:px-6 border-t border-gray-200">
            <div className="text-sm">
              <Link href="/jobs" className="font-medium text-blue-600 hover:text-blue-500">
                View all jobs<span aria-hidden="true"> &rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-4 py-5 sm:p-6 text-center">
          <p className="text-gray-500">No recommended jobs at the moment.</p>
          <div className="mt-4">
            <Link
              href="/jobs"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Browse All Jobs
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
