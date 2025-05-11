"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter } from "next/navigation"
import dynamic from 'next/dynamic'
import LoadingSpinner from "../ui/loading-spinner"
import { isAuthenticated, getUserRole } from "../../utils/auth"

// Dynamic imports for layout components
const Header = dynamic(() => import("./Header"), {
  loading: () => (
    <div className="h-16 bg-white shadow-sm animate-pulse" />
  ),
})

const Sidebar = dynamic(() => import("./Sidebar"), {
  loading: () => (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white animate-pulse" />
    </div>
  ),
})

const Footer = dynamic(() => import("./Footer"), {
  loading: () => (
    <div className="bg-white border-t border-gray-200 h-16 animate-pulse" />
  ),
})

export default function Layout({ children }) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true)
      const authStatus = isAuthenticated()
      setAuthenticated(authStatus)

      if (authStatus) {
        setUserRole(getUserRole())
      }

      // Check authorization for admin pages
      const isAdminPage = router.pathname?.startsWith("/admin")
      const isAuthorized = authStatus && (userRole === "admin" || userRole === "hr")

      if (isAdminPage && !isAuthorized && router.isReady) {
        router.push("/login?redirect=" + router.asPath)
      }

      setIsLoading(false)
    }

    initAuth()
  }, [router.pathname])

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
      <Suspense fallback={<div className="h-16 bg-white shadow-sm animate-pulse" />}>
        <Header
          authenticated={authenticated}
          userRole={userRole}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      </Suspense>

      <div className="flex flex-1">
        {showSidebar && (
          <Suspense fallback={
            <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
              <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white animate-pulse" />
            </div>
          }>
            <Sidebar 
              open={sidebarOpen} 
              setOpen={setSidebarOpen} 
              userRole={userRole} 
            />
          </Suspense>
        )}

        <main className={`flex-1 ${showSidebar ? "md:pl-64" : ""}`}>
          <Suspense fallback={<LoadingSpinner />}>
            {children}
          </Suspense>
        </main>
      </div>

      <Suspense fallback={<div className="bg-white border-t border-gray-200 h-16 animate-pulse" />}>
        <Footer />
      </Suspense>
    </div>
  )
}
