"use client"

import React from 'react';
import withAuth from '../utils/withAuth';
import JobsOverview from '../components/dashboard/JobsOverview';
import RecentApplications from '../components/dashboard/RecentApplications';
import Stats from '../components/dashboard/Stats';

function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <Stats />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <JobsOverview />
        <RecentApplications />
      </div>
    </div>
  );
}

// Protect the dashboard route for authenticated users
export default withAuth(Dashboard);
