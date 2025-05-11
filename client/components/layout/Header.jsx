"use client";

import { Fragment } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bell, MenuIcon, User } from "lucide-react";
import { logout } from "../../utils/auth";

export default function Header({
  authenticated,
  userRole,
  sidebarOpen,
  setSidebarOpen,
}) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Jobs", href: "/jobs" },
    ...(authenticated
      ? [{ name: "My Applications", href: "/applications" }]
      : []),
    ...(userRole === "admin" || userRole === "hr"
      ? [{ name: "Admin", href: "/admin" }]
      : []),
  ];

  const profileDropdownItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Profile Settings", href: "/profile" },
  ];

  return (
    <Disclosure as="nav" className="bg-background border-b border-border">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                {authenticated && (
                  <button
                    type="button"
                    className="md:hidden -ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary transition-colors duration-200"
                    onClick={() => setSidebarOpen(true)}
                  >
                    <span className="sr-only">Open sidebar</span>
                    <MenuIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                )}
                <div className="flex-shrink-0 flex items-center">
                  <Link
                    href="/"
                    className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
                  >
                    ATS System
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {menuItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                        router.pathname === item.href ||
                        router.pathname?.startsWith(item.href + "/")
                          ? "border-primary text-foreground"
                          : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex items-center">
                {authenticated ? (
                  <div className="hidden sm:ml-6 sm:flex sm:items-center">
                    <button
                      type="button"
                      className="bg-background p-1 rounded-full text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
                    >
                      <span className="sr-only">View notifications</span>
                      <Bell className="h-6 w-6" aria-hidden="true" />
                    </button>

                    <Menu as="div" className="ml-3 relative">
                      <div>
                        <Menu.Button className="bg-background rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-shadow duration-200">
                          <span className="sr-only">Open user menu</span>
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
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
                        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-background border border-border focus:outline-none">
                          {profileDropdownItems.map((item) => (
                            <Menu.Item key={item.name}>
                              {({ active }) => (
                                <Link
                                  href={item.href}
                                  className={`${
                                    active ? "bg-accent" : ""
                                  } block px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors duration-150`}
                                >
                                  {item.name}
                                </Link>
                              )}
                            </Menu.Item>
                          ))}
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={handleLogout}
                                className={`${
                                  active ? "bg-accent" : ""
                                } block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors duration-150`}
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
                    <Link
                      href="/login"
                      className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors duration-150"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/register"
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
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
              {menuItems.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={Link}
                  href={item.href}
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-150 ${
                    router.pathname === item.href ||
                    router.pathname?.startsWith(item.href + "/")
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-transparent text-muted-foreground hover:bg-accent hover:border-border hover:text-foreground"
                  }`}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>

            {authenticated && (
              <div className="pt-4 pb-3 border-t border-border">
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <User className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-foreground">
                      {JSON.parse(localStorage.getItem("userData") || "{}")
                        .name || "User"}
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">
                      {JSON.parse(localStorage.getItem("userData") || "{}")
                        .email || ""}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="ml-auto flex-shrink-0 bg-background p-1 rounded-full text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
                  >
                    <span className="sr-only">View notifications</span>
                    <Bell className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="mt-3 space-y-1">
                  {profileDropdownItems.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as={Link}
                      href={item.href}
                      className="block px-4 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-150"
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                  <Disclosure.Button
                    as="button"
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-150"
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
  );
}
