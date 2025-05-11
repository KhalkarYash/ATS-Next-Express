import { getStatusColor } from "@/utils/helpers"

export default function ApplicationStatus({ status, className = "" }) {
  const statusClass = getStatusColor(status)
  const statusText = status.charAt(0).toUpperCase() + status.slice(1)

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusClass} ${className}`}>
      {statusText}
    </span>
  )
}
