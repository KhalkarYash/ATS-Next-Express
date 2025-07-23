"use client"

import { useState } from "react"
import { Check, Clock, X, AlertCircle } from "lucide-react"

const stages = [
  { key: "pending", label: "Application Submitted", icon: Clock },
  { key: "reviewing", label: "Under Review", icon: AlertCircle },
  { key: "interview", label: "Interview Stage", icon: Clock },
  { key: "offered", label: "Job Offered", icon: Check },
  { key: "accepted", label: "Offer Accepted", icon: Check },
  { key: "rejected", label: "Application Closed", icon: X }
]

export default function ApplicationStatus({ status, className = "" }) {
  const [animate, setAnimate] = useState(false)
  
  const getStageIndex = (stage) => {
    return stages.findIndex(s => s.key === stage.toLowerCase())
  }

  const currentIndex = getStageIndex(status)

  const getStageStyle = (index) => {
    if (index < currentIndex) {
      return "completed" // Past stages
    } else if (index === currentIndex) {
      return "current" // Current stage
    }
    return "upcoming" // Future stages
  }

  const stageClasses = {
    completed: {
      icon: "bg-primary text-primary-foreground",
      line: "border-primary",
      text: "text-foreground"
    },
    current: {
      icon: "bg-primary text-primary-foreground ring-2 ring-offset-2 ring-primary/30",
      line: "border-primary/30",
      text: "text-foreground font-medium"
    },
    upcoming: {
      icon: "bg-muted text-muted-foreground",
      line: "border-muted",
      text: "text-muted-foreground"
    }
  }

  return (
    <div className={`space-y-8 ${className}`}>
      <div className="relative">
        {stages.map((stage, index) => {
          const style = getStageStyle(index)
          const Icon = stage.icon
          const isLast = index === stages.length - 1

          return (
            <div key={stage.key} className={`relative ${!isLast ? 'pb-12' : ''}`}>
              {!isLast && (
                <div className="absolute left-5 top-12 -ml-px h-full w-0.5">
                  <div className={`h-full border-l-2 transition-all duration-500 ${stageClasses[style].line}`} />
                </div>
              )}
              
              <div className="relative flex items-center space-x-4">
                <div
                  className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 ${
                    stageClasses[style].icon
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className={`text-sm transition-colors duration-200 ${stageClasses[style].text}`}>
                    {stage.label}
                  </div>
                  {style === 'current' && (
                    <div className="mt-1 text-xs text-muted-foreground">
                      Current Status
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
