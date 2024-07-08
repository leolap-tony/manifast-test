import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import QueryClientProvider from "@/components/QueryClientProvider";
import Sidenav from "@/components/Sidenav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <QueryClientProvider>
            <main className="flex">
              <Sidenav />
              {children}
            </main>
          </QueryClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
