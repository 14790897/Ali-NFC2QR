// 应用版本信息
export const APP_VERSION = "1.2.0";
export const APP_NAME = "Ali-NFC2QR";
export const APP_DESCRIPTION = "支付宝 NFC 链接解码器";
export const LAST_UPDATED = "2024年1月";
export const BUILD_DATE = new Date().toISOString().split('T')[0];

// 版本历史
export const VERSION_HISTORY = [
  {
    version: "1.2.0",
    date: "2025-07-06",
    features: [
      "修复 NFC 停止扫描功能",
      "解决 'ongoing scan' 错误",
      "添加智能重试机制",
      "新增重置功能",
      "完善 SEO 优化",
      "添加版本号显示",
    ],
  },
  {
    version: "1.1.0",
    date: "2024-01-10",
    features: [
      "添加 NFC 写入功能",
      "支持 NFC 标签复制",
      "修复 mediaType 错误",
      "增强错误处理",
      "添加故障排除文档",
    ],
  },
  {
    version: "1.0.0",
    date: "2024-01-01",
    features: [
      "基础 NFC 读取功能",
      "支付宝链接解码",
      "二维码生成",
      "响应式界面设计",
      "开源发布",
    ],
  },
];

// 获取当前版本信息
export const getCurrentVersion = () => ({
  version: APP_VERSION,
  name: APP_NAME,
  description: APP_DESCRIPTION,
  lastUpdated: LAST_UPDATED,
  buildDate: BUILD_DATE
});

// 获取版本历史
export const getVersionHistory = () => VERSION_HISTORY;

// 获取最新功能列表
export const getLatestFeatures = () => {
  const latest = VERSION_HISTORY[0];
  return latest ? latest.features : [];
};
