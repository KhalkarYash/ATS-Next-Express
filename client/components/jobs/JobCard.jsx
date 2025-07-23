"use client"

import Link from "next/link"
import { Calendar, MapPin, Clock, Briefcase, ChevronRight } from "lucide-react"
import { formatDate, truncateText } from "../../utils/helpers"

export default function JobCard({ job }) {
  const badges = {
    'full-time': 'bg-primary/10 text-primary',
    'part-time': 'bg-orange-100 text-orange-700',
    'contract': 'bg-purple-100 text-purple-700',
    'internship': 'bg-green-100 text-green-700',
    'remote': 'bg-blue-100 text-blue-700'
  }

  return (
    <div className="group relative">
      <div className="relative h-full overflow-hidden rounded-lg border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/20">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 flex-shrink-0 rounded bg-primary/10 flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold leading-6 text-card-foreground group-hover:text-primary transition-colors duration-200">
                  <Link href={`/jobs/${job.id}`} className="focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                    {job.title}
                  </Link>
                </h3>
                <p className="text-sm text-muted-foreground">{job.company}</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
          </div>
          
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
            {truncateText(job.description, 150)}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badges[job.type] || 'bg-gray-100 text-gray-800'}`}>
              {job.type}
            </span>
            {job.remote && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                Remote
              </span>
            )}
          </div>

          <div className="mt-6 flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <MapPin className="mr-1.5 h-4 w-4 flex-shrink-0" />
              {job.location}
            </div>
            <div className="flex items-center">
              <Calendar className="mr-1.5 h-4 w-4 flex-shrink-0" />
              Posted {formatDate(job.createdAt)}
            </div>
            {job.deadline && (
              <div className="flex items-center">
                <Clock className="mr-1.5 h-4 w-4 flex-shrink-0" />
                Closes {formatDate(job.deadline)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
