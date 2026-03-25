import type { Metadata } from "next";
import { League_Spartan } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const leagueSpartan = League_Spartan({
  variable: "--font-league-spartan",
  subsets: ["latin"],
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  title: "Job Listings with Filtering",
  description: "A professional job listing board with dynamic filtering",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${leagueSpartan.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
