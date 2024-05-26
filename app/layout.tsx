import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

const IBM_PLEX = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex",
});

export const metadata: Metadata = {
  title: "AesthetixAI",
  description:
    "Discover the future of image creation and editing with AesthetixAI. Our advanced AI technology enables you to craft breathtaking visuals and perfect your photos in just a few clicks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("font-IBM_PLEX antialiased", IBM_PLEX.variable)}>
        <ClerkProvider appearance={{ variables: { colorPrimary: "#624cf5" } }}>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
