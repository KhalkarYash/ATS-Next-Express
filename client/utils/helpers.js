// Helper functions for the application

// Format date to a readable string
export const formatDate = (dateString) => {
  if (!dateString) return "N/A"

  const date = new Date(dateString)

  // Check if date is valid
  if (isNaN(date.getTime())) return "Invalid date"

  // Format options
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  }

  return date.toLocaleDateString("en-US", options)
}

// Format date with time
export const formatDateTime = (dateString) => {
  if (!dateString) return "N/A"

  const date = new Date(dateString)

  // Check if date is valid
  if (isNaN(date.getTime())) return "Invalid date"

  // Format options
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }

  return date.toLocaleDateString("en-US", options)
}

// Format currency
export const formatCurrency = (amount, currency = "USD") => {
  if (amount === null || amount === undefined) return "N/A"

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount)
}

// Truncate text with ellipsis
export const truncateText = (text, maxLength = 100) => {
  if (!text) return ""

  if (text.length <= maxLength) return text

  return text.slice(0, maxLength) + "..."
}

// Get status color based on application status
export const getStatusColor = (status) => {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    reviewing: "bg-blue-100 text-blue-800",
    interview: "bg-purple-100 text-purple-800",
    offer: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    withdrawn: "bg-gray-100 text-gray-800",
  }

  return statusColors[status] || "bg-gray-100 text-gray-800"
}

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

// Validate email format
export const isValidEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

// Generate random ID (for temporary client-side IDs)
export const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Debounce function for search inputs
export const debounce = (func, wait) => {
  let timeout

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }

    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
