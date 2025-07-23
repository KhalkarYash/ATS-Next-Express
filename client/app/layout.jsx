import { Metadata } from "next";
import "./globals.css";

export const metadata = {
  title: {
    default: "ATS - Applicant Tracking System",
    template: "%s | ATS",
  },
  description:
    "A modern applicant tracking system for managing job applications, candidates, and hiring workflows",
  keywords: [
    "ATS",
    "Applicant Tracking System",
    "Job Portal",
    "Recruitment",
    "HR Management",
    "Hiring Platform",
  ],
  authors: [
    {
      name: "ATS Team",
    },
  ],
  creator: "ATS Team",
  publisher: "ATS",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
