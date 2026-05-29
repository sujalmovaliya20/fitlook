import type { Metadata, Viewport } from "next";
import { Playfair_Display, DM_Mono, Lato } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { InstallPrompt } from "@/components/install-prompt";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { ToastProvider } from "@/components/ui/Toast";

const serif = Playfair_Display({ 
  subsets: ['latin'], 
  weight: ['400','500','700'],
  style: ['normal','italic'],
  variable: '--font-serif' 
});

const mono = DM_Mono({ 
  subsets: ['latin'], 
  weight: ['300','400'],
  variable: '--font-mono'
});

const sans = Lato({ 
  subsets: ['latin'], 
  weight: ['300','400','700'],
  variable: '--font-sans' 
});

export const metadata: Metadata = {
  title: "FitLook — AI Virtual Trial Room for Fabric Shops",
  description: "Let your customers try before they buy — without stitching a single thread.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "FitLook — AI Virtual Trial Room",
    description: "See how fabrics look before they're stitched with AI.",
    images: [{ url: "/og-image.jpg" }]
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#1A1A2E",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen antialiased",
          serif.variable,
          sans.variable,
          mono.variable
        )}
      >
        <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] bg-[url('/noise.svg')]" />
        <CustomCursor />
        <ToastProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <InstallPrompt />
          </ThemeProvider>
        </ToastProvider>
      </body>
    </html>
  );
}

