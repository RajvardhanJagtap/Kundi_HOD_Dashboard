'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
  requiredRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermissions = [],
  requiredRoles = [],
}) => {
  const { isAuthenticated, isLoading, permissions, roles } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (requiredPermissions.length > 0) {
      const hasPermission = requiredPermissions.every(permission =>
        permissions.includes(permission)
      );
      if (!hasPermission) {
        router.push('/login');
        return;
      }
    }

    if (requiredRoles.length > 0) {
      const hasRole = requiredRoles.some(role => roles.includes(role));
      if (!hasRole) {
        router.push('/login');
        return;
      }
    }
  }, [isAuthenticated, isLoading, permissions, roles, requiredPermissions, requiredRoles, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#026892]"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};