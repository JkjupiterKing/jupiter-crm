import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import ModeBanner from "@/components/ModeBanner";

export const metadata: Metadata = {
  title: "Pratham Enterprises",
  description: "Sales and Service Management System for Pratham Enterprises",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <Navigation />
        <ModeBanner />
        {children}
      </body>
    </html>
  );
}
