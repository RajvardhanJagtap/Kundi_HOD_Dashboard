"use client";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function LecturerDashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredRoles={["HEAD_OF_DEPARTMENT", "SUPERADMIN"]}>{children}</ProtectedRoute>
  );
}
