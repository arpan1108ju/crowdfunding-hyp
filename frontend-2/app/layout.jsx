import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider"  
import Navbar from "@/components/navbar";

import { Toaster } from "@/components/ui/sonner";
import { Sidebar } from "@/components/sidebar";
import { AuthProvider } from "@/context/auth-context";
import { TooltipProvider } from "@/components/ui/tooltip";
import { VerificationWrapper } from "@/components/VerificationWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "FundFab",
  description: "Crowdfunding app mangaed by hyperledger fabric",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider>
              <div className="flex h-screen overflow-hidden">
                {/* Sidebar Section */}
                <Sidebar />
                
                {/* Main Content Section */}
                <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300 min-w-0">
                  <Navbar />
                  <VerificationWrapper>
                  <main className="flex-1 overflow-y-auto">
                    <div className="w-full max-w-full break-words px-4">
                      {children}
                    </div>
                  </main>
                  </VerificationWrapper>
                </div>
              </div>
              <Toaster richColors position="top-center" closeButton theme="system" duration={2000} />
            </TooltipProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
