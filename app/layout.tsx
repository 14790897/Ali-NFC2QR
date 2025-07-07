import type { Metadata, Viewport } from "next";
import "./globals.css";
import ChatwootWidget from "@/components/ChatwootWidget";

export const metadata: Metadata = {
  title: {
    default: "Ali-NFC2QR - 支付宝 NFC 链接解码器",
    template: "%s | Ali-NFC2QR",
  },
  description:
    "免费的支付宝 NFC 链接解码器，支持 NFC 读取、写入和二维码生成。一键解码支付宝收款链接，复制 NFC 标签，生成精美二维码。开源项目，安全可靠。",
  keywords: [
    "支付宝",
    "NFC",
    "二维码",
    "解码器",
    "收款码",
    "标签复制",
    "Alipay",
    "QR Code",
    "Decoder",
    "NFC Reader",
    "NFC Writer",
    "移动支付",
    "收款链接",
    "Web NFC",
    "Chrome Android",
  ],
  authors: [{ name: "14790897", url: "https://github.com/14790897" }],
  creator: "14790897",
  publisher: "14790897",
  generator: "Next.js",
  applicationName: "Ali-NFC2QR",
  referrer: "origin-when-cross-origin",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "Technology",
  classification: "NFC Tools, QR Code Generator, Mobile Payment",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    alternateLocale: ["en_US"],
    url: "https://github.com/14790897/Ali-NFC2QR",
    siteName: "Ali-NFC2QR",
    title: "Ali-NFC2QR - 免费的支付宝 NFC 链接解码器",
    description:
      "免费的支付宝 NFC 链接解码器，支持 NFC 读取、写入和二维码生成。一键解码支付宝收款链接，复制 NFC 标签，生成精美二维码。开源项目，安全可靠。",
    images: [
      {
        url: "/alipay-logo.svg",
        width: 200,
        height: 200,
        alt: "Ali-NFC2QR - 支付宝 NFC 链接解码器",
        type: "image/svg+xml",
      },
      {
        url: "/favicon.svg",
        width: 32,
        height: 32,
        alt: "Ali-NFC2QR 图标",
        type: "image/svg+xml",
      },
    ],
    videos: [],
    audio: [],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Ali_NFC2QR",
    creator: "@14790897",
    title: "Ali-NFC2QR - 免费的支付宝 NFC 链接解码器",
    description:
      "免费的支付宝 NFC 链接解码器，支持 NFC 读取、写入和二维码生成。一键解码支付宝收款链接，复制 NFC 标签。",
    images: {
      url: "/alipay-logo.svg",
      alt: "Ali-NFC2QR - 支付宝 NFC 链接解码器",
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
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
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "saq0ced6av");
            `,
          }}
        />
      </head>
      <body>
        {children}
        <ChatwootWidget />
      </body>
    </html>
  );
}
