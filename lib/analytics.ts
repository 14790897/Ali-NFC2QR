// 分析和追踪配置

// Microsoft Clarity 配置
export const CLARITY_CONFIG = {
  projectId: "saq0ced6av",
  enabled: process.env.NODE_ENV === "production", // 只在生产环境启用
};

// 自定义事件追踪
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window !== "undefined" && window.clarity) {
    try {
      // 使用 Clarity 的自定义事件追踪
      window.clarity("event", eventName, properties);
      console.log(`📊 Event tracked: ${eventName}`, properties);
    } catch (error) {
      console.warn("Failed to track event:", error);
    }
  }
};

// 页面浏览追踪
export const trackPageView = (pageName: string, url?: string) => {
  if (typeof window !== "undefined" && window.clarity) {
    try {
      window.clarity("set", "page", pageName);
      console.log(`📄 Page view tracked: ${pageName}`);
    } catch (error) {
      console.warn("Failed to track page view:", error);
    }
  }
};

// NFC 相关事件追踪
export const trackNFCEvent = (action: string, details?: Record<string, any>) => {
  trackEvent("nfc_action", {
    action,
    timestamp: new Date().toISOString(),
    ...details,
  });
};

// 用户交互追踪
export const trackUserInteraction = (element: string, action: string) => {
  trackEvent("user_interaction", {
    element,
    action,
    timestamp: new Date().toISOString(),
  });
};

// 错误追踪
export const trackError = (error: Error, context?: string) => {
  trackEvent("error", {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
  });
};

// 性能追踪
export const trackPerformance = (metric: string, value: number, unit: string = "ms") => {
  trackEvent("performance", {
    metric,
    value,
    unit,
    timestamp: new Date().toISOString(),
  });
};

// 功能使用追踪
export const trackFeatureUsage = (feature: string, success: boolean, details?: Record<string, any>) => {
  trackEvent("feature_usage", {
    feature,
    success,
    timestamp: new Date().toISOString(),
    ...details,
  });
};

// 类型定义
declare global {
  interface Window {
    clarity: (action: string, ...args: any[]) => void;
  }
}

// 常用事件名称常量
export const EVENTS = {
  // NFC 相关
  NFC_SCAN_START: "nfc_scan_start",
  NFC_SCAN_SUCCESS: "nfc_scan_success",
  NFC_SCAN_ERROR: "nfc_scan_error",
  NFC_WRITE_START: "nfc_write_start",
  NFC_WRITE_SUCCESS: "nfc_write_success",
  NFC_WRITE_ERROR: "nfc_write_error",
  
  // 二维码相关
  QR_GENERATE: "qr_generate",
  QR_DOWNLOAD: "qr_download",
  QR_COPY: "qr_copy",
  
  // 页面交互
  PROMO_VIEW: "promo_view",
  GITHUB_CLICK: "github_click",
  BANNER_CLOSE: "banner_close",
  
  // 错误相关
  PERMISSION_DENIED: "permission_denied",
  BROWSER_UNSUPPORTED: "browser_unsupported",
  DEVICE_UNSUPPORTED: "device_unsupported",
} as const;

// 使用示例：
// trackNFCEvent(EVENTS.NFC_SCAN_START, { method: "manual" });
// trackFeatureUsage("qr_generation", true, { format: "png" });
// trackUserInteraction("promo_banner", "close");
