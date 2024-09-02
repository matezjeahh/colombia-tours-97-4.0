import { Inter as FontSans } from "next/font/google";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/responsive-navbar";
import Footer from "@/components/responsive-footer";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import CookieConsentWrapper from "@/components/CookieConsentWrapper";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({ children }) {
  return (
    <html lang="hu" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
          <Toaster />

          <Footer />
          <CookieConsentWrapper />
        </ThemeProvider>
      </body>
    </html>
  );
}
