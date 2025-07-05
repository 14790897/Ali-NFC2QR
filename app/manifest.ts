import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Ali-NFC2QR - 支付宝 NFC 链接解码器',
    short_name: 'Ali-NFC2QR',
    description: '免费的支付宝 NFC 链接解码器，支持 NFC 读取、写入和二维码生成',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#00A0EA',
    orientation: 'portrait',
    scope: '/',
    lang: 'zh-CN',
    categories: ['utilities', 'productivity', 'finance'],
    icons: [
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any maskable'
      },
      {
        src: '/alipay-logo.svg',
        sizes: '200x200',
        type: 'image/svg+xml',
        purpose: 'any'
      }
    ],
    screenshots: [
      {
        src: '/alipay-logo.svg',
        sizes: '200x200',
        type: 'image/svg+xml',
        form_factor: 'narrow'
      }
    ],
    shortcuts: [
      {
        name: 'NFC 扫描',
        short_name: 'NFC 扫描',
        description: '快速启动 NFC 扫描功能',
        url: '/?action=scan',
        icons: [
          {
            src: '/favicon.svg',
            sizes: '32x32',
            type: 'image/svg+xml'
          }
        ]
      }
    ],
    related_applications: [],
    prefer_related_applications: false
  }
}
