import { APP_VERSION } from "@/lib/version";

export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://your-domain.com/#webapp",
        name: "Ali-NFC2QR",
        alternateName: "支付宝 NFC 链接解码器",
        description:
          "免费的支付宝 NFC 链接解码器，支持 NFC 读取、写入和二维码生成。一键解码支付宝收款链接，复制 NFC 标签，生成精美二维码。",
        url: "https://your-domain.com",
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Android",
        browserRequirements: "Chrome for Android 89+",
        softwareVersion: APP_VERSION,
        datePublished: "2024-01-01",
        dateModified: new Date().toISOString().split("T")[0],
        author: {
          "@type": "Person",
          name: "14790897",
          url: "https://github.com/14790897",
        },
        publisher: {
          "@type": "Organization",
          name: "Ali-NFC2QR",
          url: "https://github.com/14790897/Ali-NFC2QR",
        },
        license: "https://opensource.org/licenses/MIT",
        isAccessibleForFree: true,
        featureList: [
          "NFC 标签读取",
          "NFC 标签写入",
          "支付宝链接解码",
          "二维码生成",
          "标签复制",
          "移动端支持",
        ],
        screenshot: "https://your-domain.com/alipay-logo.svg",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "CNY",
          availability: "https://schema.org/InStock",
        },
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://your-domain.com/#software",
        name: "Ali-NFC2QR",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Web Browser",
        description: "开源的支付宝 NFC 链接解码器，基于 Web NFC API 实现",
        downloadUrl: "https://github.com/14790897/Ali-NFC2QR",
        codeRepository: "https://github.com/14790897/Ali-NFC2QR",
        programmingLanguage: ["TypeScript", "JavaScript", "React"],
        runtimePlatform: "Web Browser",
        targetProduct: {
          "@type": "SoftwareApplication",
          name: "Chrome for Android",
          operatingSystem: "Android",
        },
      },
      {
        "@type": "HowTo",
        "@id": "https://your-domain.com/#howto",
        name: "如何使用 Ali-NFC2QR 复制支付宝 NFC 标签",
        description:
          "详细步骤说明如何使用 Ali-NFC2QR 读取和复制支付宝 NFC 标签",
        image: "https://your-domain.com/alipay-logo.svg",
        totalTime: "PT2M",
        estimatedCost: {
          "@type": "MonetaryAmount",
          currency: "CNY",
          value: "0",
        },
        supply: [
          {
            "@type": "HowToSupply",
            name: "Android 手机",
          },
          {
            "@type": "HowToSupply",
            name: "Chrome 浏览器 89+",
          },
          {
            "@type": "HowToSupply",
            name: "支付宝 NFC 标签",
          },
          {
            "@type": "HowToSupply",
            name: "空白 NFC 标签",
          },
        ],
        tool: [
          {
            "@type": "HowToTool",
            name: "Ali-NFC2QR 网页应用",
          },
        ],
        step: [
          {
            "@type": "HowToStep",
            name: "打开应用",
            text: "在 Chrome for Android 中访问 Ali-NFC2QR 应用",
            url: "https://your-domain.com",
          },
          {
            "@type": "HowToStep",
            name: "开始扫描",
            text: "点击'开始扫描 NFC'按钮，授权 NFC 权限",
          },
          {
            "@type": "HowToStep",
            name: "读取标签",
            text: "将手机靠近支付宝 NFC 标签，距离 2-4 厘米",
          },
          {
            "@type": "HowToStep",
            name: "写入新标签",
            text: "点击'写入到新标签'按钮，将手机靠近空白 NFC 标签",
          },
          {
            "@type": "HowToStep",
            name: "完成复制",
            text: "等待写入成功提示，标签复制完成",
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": "https://your-domain.com/#faq",
        mainEntity: [
          {
            "@type": "Question",
            name: "Ali-NFC2QR 支持哪些设备？",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Ali-NFC2QR 支持运行 Chrome for Android 89+ 的 Android 设备，设备必须具备 NFC 功能。",
            },
          },
          {
            "@type": "Question",
            name: "数据安全如何保证？",
            acceptedAnswer: {
              "@type": "Answer",
              text: "所有 NFC 数据处理都在本地完成，不会上传任何数据到服务器，确保用户隐私和数据安全。",
            },
          },
          {
            "@type": "Question",
            name: "可以复制任何 NFC 标签吗？",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Ali-NFC2QR 支持标准 NDEF 格式的 NFC 标签，包括支付宝收款码标签。某些加密或专有格式的标签可能不支持。",
            },
          },
          {
            "@type": "Question",
            name: "应用是否免费？",
            acceptedAnswer: {
              "@type": "Answer",
              text: "是的，Ali-NFC2QR 是完全免费的开源项目，源代码在 GitHub 上公开。",
            },
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
