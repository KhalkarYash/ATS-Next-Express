"use client"

import { Fragment } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Disclosure, Menu, Transition } from "@headlessui/react"
import { Bell, MenuIcon, User } from "lucide-react"
import { logout } from "@/utils/auth"

export default function Header({ authenticated, userRole, sidebarOpen, setSidebarOpen }) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Disclosure as="nav" className="bg-white shadow-sm">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                {authenticated && (
                  <button
                    type="button"
                    className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                    onClick={() => setSidebarOpen(true)}
                  >
                    <span className="sr-only">Open sidebar</span>
                    <MenuIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                )}
                <div className="flex-shrink-0 flex items-center">
                  <Link href="/" className="text-xl font-bold text-blue-600">
                    ATS System
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link
                    href="/"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      router.pathname && router.pathname === "/" // Added null check
                        ? "border-blue-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    Home
                  </Link>
                  <Link
                    href="/jobs"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      router.pathname && router.pathname.startsWith("/jobs") // Added null check
                        ? "border-blue-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    Jobs
                  </Link>
                  {authenticated && (
                    <>
                      <Link
                        href="/applications"
                        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                          router.pathname && router.pathname.startsWith("/applications") // Added null check
                            ? "border-blue-500 text-gray-900"
                            : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                        }`}
                      >
                        My Applications
                      </Link>
                      {(userRole === "admin" || userRole === "hr") && (
                        <Link
                          href="/admin"
                          className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                            router.pathname && router.pathname.startsWith("/admin") // Added null check
                              ? "border-blue-500 text-gray-900"
                              : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                          }`}
                        >
                          Admin
                        </Link>
                      )}
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                {authenticated ? (
                  <div className="hidden sm:ml-6 sm:flex sm:items-center">
                    <button
                      type="button"
                      className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <span className="sr-only">View notifications</span>
                      <Bell className="h-6 w-6" aria-hidden="true" />
                    </button>

                    {/* Profile dropdown */}
                    <Menu as="div" className="ml-3 relative">
                      <div>
                        <Menu.Button className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                          <span className="sr-only">Open user menu</span>
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <User className="h-5 w-5" />
                          </div>
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                href="/dashboard"
                                className={`${active ? "bg-gray-100" : ""} block px-4 py-2 text-sm text-gray-700`}
                              >
                                Dashboard
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                href="/profile"
                                className={`${active ? "bg-gray-100" : ""} block px-4 py-2 text-sm text-gray-700`}
                              >
                                Profile Settings
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={handleLogout}
                                className={`${
                                  active ? "bg-gray-100" : ""
                                } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                              >
                                Sign out
                              </button>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <Link href="/login" className="text-gray-500 hover:text-gray-700 text-sm font-medium">
                      Sign in
                    </Link>
                    <Link
                      href="/register"
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              <Disclosure.Button
                as={Link}
                href="/"
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  router.pathname && router.pathname === "/" // Added null check
                    ? "bg-blue-50 border-blue-500 text-blue-700"
                    : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                Home
              </Disclosure.Button>
              <Disclosure.Button
                as={Link}
                href="/jobs"
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  router.pathname && router.pathname.startsWith("/jobs") // Added null check
                    ? "bg-blue-50 border-blue-500 text-blue-700"
                    : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                Jobs
              </Disclosure.Button>
              {authenticated && (
                <>
                  <Disclosure.Button
                    as={Link}
                    href="/applications"
                    className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                      router.pathname && router.pathname.startsWith("/applications") // Added null check
                        ? "bg-blue-50 border-blue-500 text-blue-700"
                        : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    My Applications
                  </Disclosure.Button>
                  {(userRole === "admin" || userRole === "hr") && (
                    <Disclosure.Button
                      as={Link}
                      href="/admin"
                      className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                        router.pathname && router.pathname.startsWith("/admin") // Added null check
                          ? "bg-blue-50 border-blue-500 text-blue-700"
                          : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                      }`}
                    >
                      Admin
                    </Disclosure.Button>
                  )}
                </>
              )}
            </div>
            {authenticated && (
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <User className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">
                      {JSON.parse(localStorage.getItem("userData") || "{}").name || "User"}
                    </div>
                    <div className="text-sm font-medium text-gray-500">
                      {JSON.parse(localStorage.getItem("userData") || "{}").email || ""}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="ml-auto flex-shrink-0 bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <span className="sr-only">View notifications</span>
                    <Bell className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="mt-3 space-y-1">
                  <Disclosure.Button
                    as={Link}
                    href="/dashboard"
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  >
                    Dashboard
                  </Disclosure.Button>
                  <Disclosure.Button
                    as={Link}
                    href="/profile"
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  >
                    Profile Settings
                  </Disclosure.Button>
                  <Disclosure.Button
                    as="button"
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  >
                    Sign out
                  </Disclosure.Button>
                </div>
              </div>
            )}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
