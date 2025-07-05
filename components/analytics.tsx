'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}

// Google Analytics 配置
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export function GoogleAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return

    // 加载 Google Analytics
    const script1 = document.createElement('script')
    script1.async = true
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
    document.head.appendChild(script1)

    const script2 = document.createElement('script')
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_MEASUREMENT_ID}', {
        page_title: document.title,
        page_location: window.location.href,
      });
    `
    document.head.appendChild(script2)

    return () => {
      document.head.removeChild(script1)
      document.head.removeChild(script2)
    }
  }, [])

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || !window.gtag) return

    const url = pathname + searchParams.toString()
    
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
      page_title: document.title,
    })
  }, [pathname, searchParams])

  return null
}

// 事件跟踪函数
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (!GA_MEASUREMENT_ID || !window.gtag) return

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}

// NFC 相关事件跟踪
export const trackNFCEvent = (action: 'scan_start' | 'scan_success' | 'scan_error' | 'write_start' | 'write_success' | 'write_error', details?: string) => {
  trackEvent(action, 'NFC', details)
}

// 二维码相关事件跟踪
export const trackQREvent = (action: 'generate' | 'download' | 'copy', details?: string) => {
  trackEvent(action, 'QRCode', details)
}

// 解码相关事件跟踪
export const trackDecodeEvent = (action: 'decode_start' | 'decode_success' | 'decode_error', details?: string) => {
  trackEvent(action, 'Decode', details)
}

// 百度统计组件
export function BaiduAnalytics() {
  const baiduId = process.env.NEXT_PUBLIC_BAIDU_ANALYTICS_ID

  useEffect(() => {
    if (!baiduId) return

    const script = document.createElement('script')
    script.innerHTML = `
      var _hmt = _hmt || [];
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?${baiduId}";
        var s = document.getElementsByTagName("script")[0]; 
        s.parentNode.insertBefore(hm, s);
      })();
    `
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [baiduId])

  return null
}

// 综合分析组件
export default function Analytics() {
  return (
    <>
      <GoogleAnalytics />
      <BaiduAnalytics />
    </>
  )
}
