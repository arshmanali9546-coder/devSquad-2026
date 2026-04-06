import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: "Real-Time Comments",
  description: "Socket.IO real-time comment and notification system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased text-slate-200 bg-slate-900 min-h-screen p-8">
        <Toaster position="bottom-right" />
        {children}
      </body>
    </html>
  );
}
