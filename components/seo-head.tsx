import Head from 'next/head'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string[]
  canonical?: string
  noindex?: boolean
}

export default function SEOHead({
  title = "Ali-NFC2QR - 免费的支付宝 NFC 链接解码器",
  description = "免费的支付宝 NFC 链接解码器，支持 NFC 读取、写入和二维码生成。一键解码支付宝收款链接，复制 NFC 标签，生成精美二维码。开源项目，安全可靠。",
  keywords = [
    "支付宝", "NFC", "二维码", "解码器", "收款码", "标签复制",
    "Alipay", "QR Code", "Decoder", "NFC Reader", "NFC Writer",
    "移动支付", "收款链接", "Web NFC", "Chrome Android"
  ],
  canonical,
  noindex = false
}: SEOHeadProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://your-domain.com'
  const fullCanonical = canonical ? `${baseUrl}${canonical}` : baseUrl

  return (
    <Head>
      {/* 基础 SEO */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      
      {/* 规范链接 */}
      <link rel="canonical" href={fullCanonical} />
      
      {/* 机器人指令 */}
      <meta name="robots" content={noindex ? "noindex,nofollow" : "index,follow"} />
      <meta name="googlebot" content={noindex ? "noindex,nofollow" : "index,follow"} />
      
      {/* 语言和地区 */}
      <meta name="language" content="zh-CN" />
      <meta name="geo.region" content="CN" />
      <meta name="geo.country" content="China" />
      
      {/* 移动端优化 */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Ali-NFC2QR" />
      
      {/* 安全性 */}
      <meta name="referrer" content="origin-when-cross-origin" />
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      
      {/* 缓存控制 */}
      <meta httpEquiv="Cache-Control" content="public, max-age=31536000" />
      
      {/* DNS 预取 */}
      <link rel="dns-prefetch" href="//github.com" />
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      
      {/* 预连接 */}
      <link rel="preconnect" href="https://github.com" crossOrigin="anonymous" />
      
      {/* 作者信息 */}
      <meta name="author" content="14790897" />
      <meta name="creator" content="14790897" />
      <meta name="publisher" content="Ali-NFC2QR" />
      
      {/* 版权信息 */}
      <meta name="copyright" content="© 2024 Ali-NFC2QR. MIT License." />
      
      {/* 应用信息 */}
      <meta name="application-name" content="Ali-NFC2QR" />
      <meta name="msapplication-TileColor" content="#00A0EA" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
      
      {/* 搜索引擎验证 */}
      <meta name="google-site-verification" content="your-google-verification-code" />
      <meta name="baidu-site-verification" content="your-baidu-verification-code" />
      <meta name="360-site-verification" content="your-360-verification-code" />
      <meta name="sogou_site_verification" content="your-sogou-verification-code" />
      
      {/* 分类标签 */}
      <meta name="category" content="Technology" />
      <meta name="classification" content="NFC Tools, QR Code Generator, Mobile Payment" />
      <meta name="subject" content="NFC Technology, Mobile Payment, QR Code" />
      
      {/* 内容评级 */}
      <meta name="rating" content="general" />
      <meta name="distribution" content="global" />
      
      {/* 重新访问 */}
      <meta name="revisit-after" content="7 days" />
      
      {/* 页面类型 */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Ali-NFC2QR" />
      
      {/* 结构化数据标记 */}
      <meta name="schema.org" content="WebApplication" />
    </Head>
  )
}
