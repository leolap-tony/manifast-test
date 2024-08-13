import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import QueryClientProvider from "@/components/QueryClientProvider";

export const metadata: Metadata = {
  title: "매니패스트",
  description: "매니패스트 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <SessionProvider>
          <QueryClientProvider>
            <div className="page-frame">{children}</div>
          </QueryClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
