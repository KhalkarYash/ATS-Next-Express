"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, validateToken, getUserRole } from './auth';

// HOC to protect routes that require authentication
export default function withAuth(WrappedComponent, requiredRole = null) {
  return function WithAuthWrapper(props) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const checkAuth = async () => {
        if (!isAuthenticated()) {
          router.replace('/login');
          return;
        }

        try {
          const isValid = await validateToken();
          if (!isValid) {
            router.replace('/login');
            return;
          }

          if (requiredRole) {
            const userRole = getUserRole();
            if (!userRole || (Array.isArray(requiredRole) ? !requiredRole.includes(userRole) : userRole !== requiredRole)) {
              router.replace('/unauthorized');
              return;
            }
          }

          setIsLoading(false);
        } catch (error) {
          console.error('Auth check failed:', error);
          router.replace('/login');
        }
      };

      checkAuth();
    }, [router]);

    if (isLoading) {
      return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    return <WrappedComponent {...props} />;
  };
}