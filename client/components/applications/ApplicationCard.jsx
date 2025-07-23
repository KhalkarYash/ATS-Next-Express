"use client"

import Link from "next/link"
import { formatDate, getStatusColor } from "@/utils/helpers"
import { Calendar, Clock, Building, FileText, ChevronRight } from "lucide-react"

export default function ApplicationCard({ application }) {
  const getStatusBadgeClasses = (status) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
    switch (status.toLowerCase()) {
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`
      case 'reviewing':
        return `${baseClasses} bg-blue-100 text-blue-800`
      case 'interview':
        return `${baseClasses} bg-purple-100 text-purple-800`
      case 'offered':
        return `${baseClasses} bg-green-100 text-green-800`
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800`
      case 'accepted':
        return `${baseClasses} bg-primary/10 text-primary`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`
    }
  }

  return (
    <div className="group relative">
      <div className="relative overflow-hidden rounded-lg border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 flex-shrink-0 rounded bg-primary/10 flex items-center justify-center">
              <Building className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold leading-6 text-card-foreground group-hover:text-primary transition-colors duration-200">
                <Link href={`/applications/${application.id}`} className="focus:outline-none">
                  <span className="absolute inset-0" aria-hidden="true" />
                  {application.jobTitle}
                </Link>
              </h3>
              <p className="text-sm text-muted-foreground">{application.company}</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
        </div>

        <div className="mt-2 flex items-center justify-between">
          <span className={getStatusBadgeClasses(application.status)}>
            {application.status}
          </span>
          {application.coverletter && (
            <div className="flex items-center text-sm text-muted-foreground">
              <FileText className="mr-1.5 h-4 w-4" />
              Cover Letter Attached
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="mr-1.5 h-4 w-4 flex-shrink-0" />
            Applied {formatDate(application.createdAt)}
          </div>
          <div className="flex items-center">
            <Clock className="mr-1.5 h-4 w-4 flex-shrink-0" />
            Last updated {formatDate(application.updatedAt)}
          </div>
        </div>

        {application.lastNote && (
          <div className="mt-4 rounded-md bg-accent/50 p-3">
            <p className="text-sm text-muted-foreground italic">"{application.lastNote}"</p>
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <Link
            href={`/applications/${application.id}`}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-md shadow-sm transition-colors duration-200"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}
