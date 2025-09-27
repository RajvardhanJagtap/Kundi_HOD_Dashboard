import type React from "react";
import { cookies } from "next/headers";
import { AuthProvider } from "@/contexts/AuthContext";
import { ConditionalLayout } from "@/components/ConditionalLayout";
import QueryProvider from "@/components/providers/QueryProvider"
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = true;

  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
        <AuthProvider>
          <ConditionalLayout defaultOpen={defaultOpen}>
            {children}
          </ConditionalLayout>
        </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

export const metadata = {
  title: "SAMPS UR - HOD Portal",
  description: "HOD Dashboard for SAMPS UR",
};