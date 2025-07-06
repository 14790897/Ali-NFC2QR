# Microsoft Clarity 分析配置

## 概述

已为 Ali-NFC2QR 项目集成 Microsoft Clarity 网站分析工具，用于了解用户行为和优化产品体验。

## 配置详情

### Clarity 项目 ID
- **项目 ID**: `saq0ced6av`
- **环境**: 仅在生产环境启用
- **隐私**: 符合 GDPR 和隐私保护要求

### 集成位置

**1. 全局脚本 (app/layout.tsx)**
```typescript
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
```

**2. 分析工具库 (lib/analytics.ts)**
- 统一的事件追踪接口
- 类型安全的事件定义
- 错误处理和调试日志

## 追踪的事件

### NFC 相关事件

| 事件名称 | 触发时机 | 追踪数据 |
|---------|---------|---------|
| `nfc_scan_start` | 开始 NFC 扫描 | 权限状态、用户代理 |
| `nfc_scan_success` | NFC 读取成功 | 记录数量、数据长度、记录类型 |
| `nfc_scan_error` | NFC 读取失败 | 错误类型、时间戳 |
| `nfc_write_start` | 开始 NFC 写入 | 记录数量、记录类型 |
| `nfc_write_success` | NFC 写入成功 | 记录数量、记录类型 |
| `nfc_write_error` | NFC 写入失败 | 错误信息、时间戳 |

### 二维码相关事件

| 事件名称 | 触发时机 | 追踪数据 |
|---------|---------|---------|
| `qr_generate` | 生成二维码 | 是否有 Logo、生成方法 |
| `qr_download` | 下载二维码 | 文件格式、文件名 |
| `qr_copy` | 复制二维码链接 | 链接长度、复制方法 |

### 用户交互事件

| 事件名称 | 触发时机 | 追踪数据 |
|---------|---------|---------|
| `promo_banner.close` | 关闭宣传横幅 | 时间戳 |
| `promo_banner.view_details` | 点击查看详情 | 时间戳 |
| `promo_banner.github_click` | 点击 GitHub 链接 | 时间戳 |

### 错误和性能事件

| 事件名称 | 触发时机 | 追踪数据 |
|---------|---------|---------|
| `permission_denied` | 权限被拒绝 | 权限类型、浏览器信息 |
| `browser_unsupported` | 浏览器不支持 | 用户代理、缺失功能 |
| `device_unsupported` | 设备不支持 | 设备信息、平台 |

## 使用方法

### 基本事件追踪
```typescript
import { trackEvent } from "@/lib/analytics";

// 追踪自定义事件
trackEvent("custom_action", {
  property1: "value1",
  property2: "value2",
});
```

### NFC 事件追踪
```typescript
import { trackNFCEvent, EVENTS } from "@/lib/analytics";

// 追踪 NFC 扫描开始
trackNFCEvent(EVENTS.NFC_SCAN_START, {
  hasPermission: true,
  userAgent: navigator.userAgent,
});
```

### 功能使用追踪
```typescript
import { trackFeatureUsage } from "@/lib/analytics";

// 追踪功能使用
trackFeatureUsage("qr_generation", true, {
  format: "png",
  hasLogo: true,
});
```

### 用户交互追踪
```typescript
import { trackUserInteraction } from "@/lib/analytics";

// 追踪用户交互
trackUserInteraction("button", "click");
```

## 数据隐私

### 隐私保护措施
- **本地处理**: 所有 NFC 数据在本地处理，不上传到服务器
- **匿名化**: Clarity 收集的数据已匿名化
- **最小化**: 只收集必要的使用统计数据
- **透明度**: 用户可以了解收集的数据类型

### 收集的数据类型
- **页面浏览**: 访问的页面和停留时间
- **用户交互**: 点击、滚动等基本交互
- **功能使用**: NFC 读写成功率、二维码生成次数
- **错误信息**: 技术错误和失败原因（不包含个人数据）

### 不收集的数据
- **个人身份信息**: 姓名、邮箱、电话等
- **NFC 标签内容**: 支付宝链接或其他敏感数据
- **设备标识符**: IMEI、MAC 地址等
- **位置信息**: GPS 坐标或精确位置

## 分析仪表板

### 访问方式
1. 登录 [Microsoft Clarity](https://clarity.microsoft.com/)
2. 选择项目 ID: `saq0ced6av`
3. 查看实时和历史数据

### 关键指标
- **页面浏览量**: 总访问次数和独立访客
- **功能使用率**: NFC 读写成功率
- **用户流程**: 从访问到功能使用的路径
- **错误率**: 各种错误的发生频率
- **设备兼容性**: 不同设备和浏览器的使用情况

### 热力图分析
- **点击热力图**: 用户最常点击的区域
- **滚动热力图**: 用户阅读行为分析
- **移动端体验**: 触摸交互模式

## 性能监控

### 自动追踪
- **页面加载时间**: 首次内容绘制、最大内容绘制
- **交互响应**: 首次输入延迟、累积布局偏移
- **资源加载**: JavaScript、CSS、图片加载时间

### 自定义性能指标
```typescript
import { trackPerformance } from "@/lib/analytics";

// 追踪自定义性能指标
trackPerformance("nfc_scan_duration", 1500, "ms");
trackPerformance("qr_generation_time", 200, "ms");
```

## 开发和调试

### 本地开发
- 分析脚本仅在生产环境加载
- 开发环境会显示调试日志
- 可以通过控制台查看事件追踪

### 调试模式
```typescript
// 在浏览器控制台中查看追踪事件
console.log("📊 Event tracked:", eventName, properties);
```

### 测试验证
1. 部署到生产环境
2. 在 Clarity 仪表板中查看实时数据
3. 验证事件是否正确触发

## 维护和更新

### 定期检查
- **每月**: 查看关键指标和用户行为
- **每季度**: 分析功能使用趋势
- **每年**: 评估分析策略和隐私政策

### 数据保留
- **Clarity**: 数据保留 90 天
- **导出**: 定期导出重要数据进行长期分析
- **清理**: 自动清理过期数据

---

*配置完成时间：2025年7月*  
*维护者：14790897*  
*Clarity 项目 ID：saq0ced6av*
