import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ali-NFC2QR - 支付宝 NFC 链接解码器",
  description:
    "支付宝 NFC 链接解码器，将 NFC 链接转换为二维码。开源项目，支持一键解码和二维码生成。",
  keywords: [
    "支付宝",
    "NFC",
    "二维码",
    "解码器",
    "Alipay",
    "QR Code",
    "Decoder",
  ],
  authors: [{ name: "14790897", url: "https://github.com/14790897" }],
  creator: "14790897",
  publisher: "14790897",
  generator: "Next.js",
  applicationName: "Ali-NFC2QR",
  referrer: "origin-when-cross-origin",

  robots: "index, follow",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://github.com/14790897/Ali-NFC2QR",
    siteName: "Ali-NFC2QR",
    title: "Ali-NFC2QR - 支付宝 NFC 链接解码器",
    description:
      "支付宝 NFC 链接解码器，将 NFC 链接转换为二维码。开源项目，支持一键解码和二维码生成。",
    images: [
      {
        url: "/alipay-logo.svg",
        width: 200,
        height: 200,
        alt: "Ali-NFC2QR Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ali-NFC2QR - 支付宝 NFC 链接解码器",
    description: "支付宝 NFC 链接解码器，将 NFC 链接转换为二维码。",
    images: ["/alipay-logo.svg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
  themeColor: "#00A0EA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
      </head>
      <body>{children}</body>
    </html>
  );
}
