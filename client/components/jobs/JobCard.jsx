import Link from "next/link"
import { Briefcase, MapPin, Clock, DollarSign } from "lucide-react"
import { formatDate, truncateText } from "@/utils/helpers"

export default function JobCard({ job, onApply, isAuthenticated }) {
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              <Link href={`/jobs/${job.id}`} className="hover:text-blue-600">
                {job.title}
              </Link>
            </h3>
            <p className="text-sm text-gray-500 mb-2">{job.company}</p>
          </div>
          {job.featured && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Featured
            </span>
          )}
        </div>

        <div className="mt-2 flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-500">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            {job.location}
          </div>
          <div className="flex items-center">
            <Briefcase className="h-4 w-4 mr-1 flex-shrink-0" />
            {job.type}
          </div>
          {job.salary && (
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-1 flex-shrink-0" />
              {job.salary}
            </div>
          )}
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
            Posted {formatDate(job.createdAt)}
          </div>
        </div>

        <div className="mt-3">
          <p className="text-sm text-gray-600">{truncateText(job.description, 120)}</p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {job.skills &&
            job.skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {skill}
              </span>
            ))}
        </div>
      </div>

      <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
        <span className="text-xs text-gray-500">
          {job.applications} {job.applications === 1 ? "application" : "applications"}
        </span>
        <div className="flex items-center space-x-2">
          <Link
            href={`/jobs/${job.id}`}
        >
          View Details
        </Link>
      </div>
    </div>
    </div>
  )
}
