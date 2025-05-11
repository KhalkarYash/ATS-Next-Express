// API client for making requests to the backend

// Base URL for API requests
const API_BASE_URL = "/api"
// const API_BASE_URL = "https://ats-next-express.onrender.com"

// Helper function to get the auth token from localStorage
const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken")
  }
  return null
}

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json()

  if (!response.ok) {
    // If the server responded with an error message, use it
    const error = data.message || response.statusText
    throw new Error(error)
  }

  return data
}

// Generic fetch function with authentication
const fetchWithAuth = async (endpoint, options = {}) => {
  const token = getAuthToken()

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const config = {
    ...options,
    headers,
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
    return await handleResponse(response)
  } catch (error) {
    console.error("API request failed:", error)
    throw error
  }
}

// Authentication API calls
export const login = async (email, password) => {
  const data = await fetchWithAuth("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })

  // Store the token in localStorage
  localStorage.setItem("authToken", data.token)

  // Store basic user data
  if (data.user) {
    localStorage.setItem("userData", JSON.stringify(data.user))
  }

  return data
}

export const logout = async () => {
  try {
    // Call the backend logout endpoint
    await fetchWithAuth("/auth/logout", {
      method: "POST"
    })
  } catch (error) {
    console.error("Logout failed:", error)
  } finally {
    // Clear local storage regardless of API call success
    localStorage.removeItem("authToken")
    localStorage.removeItem("userData")
  }
}

export const register = async (userData) => {
  return await fetchWithAuth("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  })
}

export const fetchUserData = async () => {
  return await fetchWithAuth("/users/me")
}

export const updateUserProfile = async (userData) => {
  return await fetchWithAuth("/users/me", {
    method: "PUT",
    body: JSON.stringify(userData),
  })
}

// Jobs API calls
export const fetchJobs = async (params = {}) => {
  const queryParams = new URLSearchParams()

  // Add pagination params
  if (params.page) queryParams.append("page", params.page)
  if (params.limit) queryParams.append("limit", params.limit)

  // Add filter params
  if (params.search) queryParams.append("search", params.search)
  if (params.location) queryParams.append("location", params.location)
  if (params.department) queryParams.append("department", params.department)
  if (params.type) queryParams.append("type", params.type)
  if (params.recommended) queryParams.append("recommended", true)

  const queryString = queryParams.toString()
  const endpoint = `/jobs${queryString ? `?${queryString}` : ""}`

  return await fetchWithAuth(endpoint)
}

export const fetchJobById = async (id) => {
  return await fetchWithAuth(`/jobs/${id}`)
}

export const createJob = async (jobData) => {
  return await fetchWithAuth("/jobs", {
    method: "POST",
    body: JSON.stringify(jobData),
  })
}

export const updateJob = async (id, jobData) => {
  return await fetchWithAuth(`/jobs/${id}`, {
    method: "PUT",
    body: JSON.stringify(jobData),
  })
}

export const deleteJob = async (id) => {
  return await fetchWithAuth(`/jobs/${id}`, {
    method: "DELETE",
  })
}

// Applications API calls
export const fetchUserApplications = async (params = {}) => {
  const queryParams = new URLSearchParams()

  // Add pagination params
  if (params.page) queryParams.append("page", params.page)
  if (params.limit) queryParams.append("limit", params.limit)

  // Add filter params
  if (params.status) queryParams.append("status", params.status)

  const queryString = queryParams.toString()
  const endpoint = `/applications/my-applications${queryString ? `?${queryString}` : ""}`

  return await fetchWithAuth(endpoint)
}

export const fetchApplicationById = async (id) => {
  return await fetchWithAuth(`/applications/${id}`)
}

export const submitApplication = async (applicationData) => {
  return await fetchWithAuth("/applications", {
    method: "POST",
    body: JSON.stringify(applicationData),
  })
}

export const withdrawApplication = async (id) => {
  return await fetchWithAuth(`/applications/${id}`, {
    method: "DELETE",
  })
}

// Resume API calls
export const uploadResume = async (formData) => {
  const token = getAuthToken()

  const headers = {
    Authorization: `Bearer ${token}`,
    // Note: Don't set Content-Type here, it will be set automatically with the boundary
  }

  try {
    const response = await fetch(`${API_BASE_URL}/resumes`, {
      method: "POST",
      headers,
      body: formData,
    })

    return await handleResponse(response)
  } catch (error) {
    console.error("Resume upload failed:", error)
    throw error
  }
}

// Admin API calls
export const fetchAdminOverview = async () => {
  return await fetchWithAuth("/admin/overview")
}

export const fetchAllUsers = async (params = {}) => {
  const queryParams = new URLSearchParams()

  // Add pagination params
  if (params.page) queryParams.append("page", params.page)
  if (params.limit) queryParams.append("limit", params.limit)

  // Add filter params
  if (params.search) queryParams.append("search", params.search)
  if (params.role) queryParams.append("role", params.role)

  const queryString = queryParams.toString()
  const endpoint = `/admin/users${queryString ? `?${queryString}` : ""}`

  return await fetchWithAuth(endpoint)
}

export const fetchAllApplications = async (params = {}) => {
  const queryParams = new URLSearchParams()

  // Add pagination params
  if (params.page) queryParams.append("page", params.page)
  if (params.limit) queryParams.append("limit", params.limit)

  // Add filter params
  if (params.status) queryParams.append("status", params.status)
  if (params.jobId) queryParams.append("jobId", params.jobId)
  if (params.search) queryParams.append("search", params.search)

  const queryString = queryParams.toString()
  const endpoint = `/applications${queryString ? `?${queryString}` : ""}`

  return await fetchWithAuth(endpoint)
}

export const updateApplicationStatus = async (id, status, notes) => {
  return await fetchWithAuth(`/pipeline/${id}/update`, {
    method: "POST",
    body: JSON.stringify({ status, notes }),
  })
}

export const fetchPipelineHistory = async (applicationId) => {
  return await fetchWithAuth(`/pipeline/${applicationId}`)
}

export const fetchAdminAnalytics = async () => {
  return await fetchWithAuth("/admin/analytics")
}

export const adminSearch = async (query) => {
  return await fetchWithAuth(`/admin/search?q=${encodeURIComponent(query)}`)
}
