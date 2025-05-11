"use client"

import { useState, useRef } from "react"
import { Upload, X, File, Check, AlertCircle } from "lucide-react"
import { uploadResume } from "@/utils/api"

export default function ResumeUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef(null)

  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]

  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    setError("")

    const droppedFile = e.dataTransfer.files[0]
    validateAndSetFile(droppedFile)
  }

  const handleFileSelect = (e) => {
    setError("")
    const selectedFile = e.target.files[0]
    validateAndSetFile(selectedFile)
  }

  const validateAndSetFile = (file) => {
    if (!file) return

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a PDF or Word document")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size should be less than 5MB")
      return
    }

    setFile(file)
    setSuccess(false)
  }

  const handleUpload = async () => {
    if (!file) return

    try {
      setUploading(true)
      setError("")
      
      const formData = new FormData()
      formData.append("resume", file)
      
      const response = await uploadResume(formData)
      
      setSuccess(true)
      setFile(null)
      if (onUploadSuccess) {
        onUploadSuccess(response)
      }
    } catch (err) {
      setError(err.message || "Failed to upload resume. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const removeFile = () => {
    setFile(null)
    setError("")
    setSuccess(false)
  }

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50"
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept=".pdf,.doc,.docx"
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="rounded-full bg-primary/10 p-3">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <div className="text-center">
            <p className="text-base font-medium text-foreground">
              {file ? file.name : "Drop your resume here"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              or{" "}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-primary hover:text-primary/80 font-medium focus:outline-none"
              >
                browse files
              </button>
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              PDF or Word documents up to 5MB
            </p>
          </div>
        </div>

        {file && (
          <div className="mt-4 flex items-center justify-between rounded-md border border-border bg-card p-3">
            <div className="flex items-center space-x-2">
              <File className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-foreground truncate max-w-[200px]">
                {file.name}
              </span>
            </div>
            <button
              type="button"
              onClick={removeFile}
              className="rounded-full p-1 hover:bg-accent transition-colors duration-200"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 flex items-center space-x-2 text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {success && (
        <div className="mt-3 flex items-center space-x-2 text-green-600">
          <Check className="h-4 w-4" />
          <span className="text-sm">Resume uploaded successfully!</span>
        </div>
      )}

      {file && !success && (
        <div className="mt-4">
          <button
            type="button"
            onClick={handleUpload}
            disabled={uploading}
            className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {uploading ? "Uploading..." : "Upload Resume"}
          </button>
        </div>
      )}
    </div>
  )
}
