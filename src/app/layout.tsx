import type { Metadata } from "next";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { AuthProvider } from "@/contexts/AuthContext";
import { ConfigProvider } from "antd";
import Script from "next/script";
import Layout from "@/layouts/Layout";

export const metadata: Metadata = {
  title: "AI App",
  description: "AI App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-FMC0LYWVF3"
      />
      <Script
        id="google-analytics"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-FMC0LYWVF3');
          `,
        }}
      />
      <body className="antialiased">
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#141414",
            },
          }}
        >
          <AuthProvider>
            <AntdRegistry>
              <Layout>{children}</Layout>
            </AntdRegistry>
          </AuthProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}
