"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter } from "next/navigation"
import dynamic from 'next/dynamic'
import LoadingSpinner from "../ui/loading-spinner"
import { isAuthenticated, getUserRole } from "../../utils/auth"

const Header = dynamic(() => import("./Header"))
const Sidebar = dynamic(() => import("./Sidebar"))
const Footer = dynamic(() => import("./Footer"))

export default function Layout({ children }) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = () => {
      try {
        setIsLoading(true)
        const authStatus = isAuthenticated()
        setAuthenticated(authStatus)

        if (authStatus) {
          const role = getUserRole()
          setUserRole(role)

          // Check authorization for admin pages
          const isAdminPage = router.pathname?.startsWith("/admin")
          const isAuthorized = role === "admin" || role === "hr"

          if (isAdminPage && !isAuthorized && router.isReady) {
            router.push("/login?redirect=" + router.asPath)
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error)
        setAuthenticated(false)
        setUserRole(null)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [router])

  const showSidebar = authenticated && 
    router.pathname && 
    !router.pathname.startsWith("/login") && 
    !router.pathname.startsWith("/register")

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="h-16 bg-white shadow-sm animate-pulse" />
        <div className="flex-1 flex">
          <div className="flex-1 animate-pulse bg-gray-100" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header 
        authenticated={authenticated}
        userRole={userRole}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex flex-1">
        {showSidebar && (
          <Sidebar 
            open={sidebarOpen} 
            setOpen={setSidebarOpen} 
            userRole={userRole} 
          />
        )}

        <main className={`flex-1 ${showSidebar ? "md:pl-64" : ""}`}>
          {children}
        </main>
      </div>

      <Footer />
    </div>
  )
}
