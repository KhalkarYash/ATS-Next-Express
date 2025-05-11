"use client"

import { useState } from "react"
import { Upload, File, AlertCircle, CheckCircle } from "lucide-react"
import { uploadResume } from "@/utils/api"
import { formatFileSize } from "@/utils/helpers"

export default function ResumeUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]

    if (!selectedFile) {
      setFile(null)
      return
    }

    // Validate file type (PDF only)
    if (selectedFile.type !== "application/pdf") {
      setError("Only PDF files are accepted")
      setFile(null)
      return
    }

    // Validate file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB")
      setFile(null)
      return
    }

    setError(null)
    setFile(selectedFile)
  }

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload")
      return
    }

    try {
      setUploading(true)
      setError(null)

      const formData = new FormData()
      formData.append("resume", file)

      const response = await uploadResume(formData)

      setSuccess(true)

      // Call the callback with the resume ID
      if (onUploadSuccess) {
        onUploadSuccess(response.resumeId)
      }
    } catch (err) {
      setError(err.message || "Failed to upload resume. Please try again.")
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && (
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
      )}

      {success ? (
        <div className="bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">Resume uploaded successfully!</p>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="resume-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PDF only (max 5MB)</p>
              </div>
              <input
                id="resume-upload"
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileChange}
                disabled={uploading}
              />
            </label>
          </div>

          {file && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <File className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleUpload}
                disabled={uploading}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
