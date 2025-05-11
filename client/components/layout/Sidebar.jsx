"use client"

import { Fragment, memo } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { X, Home, Briefcase, FileText, User, Settings, BarChart2, Users, Search } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Memoize navigation items to prevent unnecessary re-renders
const NavigationItem = memo(({ item, isActive, onClick }) => (
  <Link
    href={item.href}
    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-200 ease-in-out ${
      isActive
        ? "bg-primary/10 text-primary"
        : "text-gray-600 hover:bg-gray-50 hover:text-primary"
    }`}
    onClick={onClick}
  >
    <item.icon
      className={`mr-3 flex-shrink-0 h-5 w-5 transition-colors duration-200 ${
        isActive
          ? "text-primary"
          : "text-gray-400 group-hover:text-primary/70"
      }`}
      aria-hidden="true"
    />
    <span className="truncate">{item.name}</span>
  </Link>
));

NavigationItem.displayName = 'NavigationItem';

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Browse Jobs", href: "/jobs", icon: Search },
  { name: "My Applications", href: "/applications", icon: FileText },
  { name: "Profile", href: "/profile", icon: User },
];

const adminNavigation = [
  { name: "Admin Dashboard", href: "/admin", icon: BarChart2 },
  { name: "Manage Jobs", href: "/admin/jobs", icon: Briefcase },
  { name: "Applications", href: "/admin/applications", icon: FileText },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

function Sidebar({ open, setOpen, userRole }) {
  const router = useRouter()
  const isAdmin = userRole === "admin" || userRole === "hr"

  const isActiveRoute = (href) => {
    return router.pathname === href || router.pathname.startsWith(href + "/")
  }

  return (
    <>
      {/* Mobile sidebar */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog 
          as="div" 
          className="fixed inset-0 flex z-40 md:hidden" 
          onClose={setOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    type="button"
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <X className="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </Transition.Child>

              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 flex items-center px-4">
                  <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    ATS System
                  </span>
                </div>

                <nav className="mt-5 px-2 space-y-1">
                  {navigation.map((item) => (
                    <NavigationItem
                      key={item.name}
                      item={item}
                      isActive={isActiveRoute(item.href)}
                      onClick={() => setOpen(false)}
                    />
                  ))}
                </nav>

                {isAdmin && (
                  <div className="mt-8">
                    <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Admin
                    </h3>
                    <nav className="mt-1 px-2 space-y-1">
                      {adminNavigation.map((item) => (
                        <NavigationItem
                          key={item.name}
                          item={item}
                          isActive={isActiveRoute(item.href)}
                          onClick={() => setOpen(false)}
                        />
                      ))}
                    </nav>
                  </div>
                )}
              </div>
            </div>
          </Transition.Child>
          <div className="flex-shrink-0 w-14" aria-hidden="true">
            {/* Dummy element to force sidebar to shrink to fit close icon */}
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 scrollbar-track-transparent">
            <div className="flex items-center flex-shrink-0 px-4">
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                ATS System
              </span>
            </div>

            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <NavigationItem
                  key={item.name}
                  item={item}
                  isActive={isActiveRoute(item.href)}
                />
              ))}
            </nav>

            {isAdmin && (
              <div className="mt-8">
                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Admin
                </h3>
                <nav className="mt-1 px-2 space-y-1">
                  {adminNavigation.map((item) => (
                    <NavigationItem
                      key={item.name}
                      item={item}
                      isActive={isActiveRoute(item.href)}
                    />
                  ))}
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
