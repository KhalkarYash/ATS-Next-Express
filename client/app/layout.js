import React from 'react';
import './globals.css';

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Bar */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="text-xl font-bold">ATS</div>
          <ul className="flex space-x-4">
            <li><a href="/" className="text-gray-700 hover:text-blue-500">Home</a></li>
            <li><a href="/dashboard" className="text-gray-700 hover:text-blue-500">Dashboard</a></li>
            <li><a href="/jobs" className="text-gray-700 hover:text-blue-500">Jobs</a></li>
            <li><a href="/profile" className="text-gray-700 hover:text-blue-500">Profile</a></li>
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-4">
        <div className="container mx-auto text-center text-gray-600">
          © {new Date().getFullYear()} ATS. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
