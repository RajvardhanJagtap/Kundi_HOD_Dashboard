import type React from "react";
import { cookies } from "next/headers";
import { ConditionalLayout } from "@/components/ConditionalLayout";
import ClientProviders from "@/components/ClientProviders";
import "./globals.css";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = true;

  return (
    <html lang="en">
      <body className="font-sans">
        <ClientProviders>
          <ConditionalLayout defaultOpen={defaultOpen}>
            {children}
          </ConditionalLayout>
        </ClientProviders>
      </body>
    </html>
  );
}

export const metadata = {
  title: "SAMPS UR - HOD Portal",
  description: "HOD Dashboard for SAMPS UR",
  icons: {
    icon: "/img/logo.jpeg",
    apple: "/img/logo.jpeg",
  },
};
