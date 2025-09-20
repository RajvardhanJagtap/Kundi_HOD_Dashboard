"use client";

import { usePathname } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { HeaderContent } from "@/components/header-content";

interface ConditionalLayoutProps {
  children: React.ReactNode;
  defaultOpen: boolean;
}

export function ConditionalLayout({ children, defaultOpen }: ConditionalLayoutProps) {
  const pathname = usePathname();
  
  // Routes that should not have sidebar and header
  const publicRoutes = ["/login"];
  
  const isPublicRoute = publicRoutes.includes(pathname);

  if (isPublicRoute) {
    // Render children without sidebar and header for public routes
    return <>{children}</>;
  }

  // Render with sidebar and header for authenticated routes
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <HeaderContent>{children}</HeaderContent>
    </SidebarProvider>
  );
}
