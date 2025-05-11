"use client";

import React from 'react';
import withAuth from '../../utils/withAuth';
import AdminDashboard from '../../components/admin/AdminDashboard';

function AdminPage() {
  return <AdminDashboard />;
}

// Protect admin routes for admin and HR roles only
export default withAuth(AdminPage, ['admin', 'hr']);