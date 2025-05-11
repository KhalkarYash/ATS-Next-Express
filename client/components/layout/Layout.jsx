"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Header from "./Header"
import Footer from "./Footer"
import Sidebar from "./Sidebar"
import { isAuthenticated, getUserRole } from "@/utils/auth"

export default function Layout({ children }) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState(null)

  useEffect(() => {
    // Check authentication status
    const authStatus = isAuthenticated()
    setAuthenticated(authStatus)

    if (authStatus) {
      setUserRole(getUserRole())
    }
  }, [router.pathname])

  // Determine if the current page is an admin page
  const isAdminPage = router.pathname && router.pathname.startsWith("/admin")

  // Check if the user is authorized to access admin pages
  const isAuthorized = authenticated && (userRole === "admin" || userRole === "hr")

  // Redirect unauthorized users trying to access admin pages
  useEffect(() => {
    if (isAdminPage && !isAuthorized && router.isReady) {
      router.push("/login?redirect=" + router.asPath)
    }
  }, [isAdminPage, isAuthorized, router])

  // Show sidebar only for authenticated users
  const showSidebar =
    authenticated &&
    router.pathname &&
    !router.pathname.startsWith("/login") &&
    !router.pathname.startsWith("/register")

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        authenticated={authenticated}
        userRole={userRole}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex flex-1">
        {showSidebar && <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} userRole={userRole} />}

        <main className={`flex-1 ${showSidebar ? "md:pl-64" : ""}`}>{children}</main>
      </div>

      <Footer />
    </div>
  )
}
