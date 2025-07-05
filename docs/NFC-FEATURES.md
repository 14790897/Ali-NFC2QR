# NFC 功能详细说明

## 概述

Ali-NFC2QR 现在支持完整的 NFC 读取和写入功能，可以实现 NFC 标签的复制和数据传输。

## 功能特性

### 1. NFC 读取
- 📱 支持读取各种 NDEF 格式的 NFC 标签
- 🔍 自动识别文本、URL、MIME 类型等记录
- 💾 保存完整的记录数据用于后续写入
- 🎯 专门优化支付宝 NFC 链接的解码

### 2. NFC 写入
- ✏️ 将读取的数据完整写入到新的 NFC 标签
- 🔄 支持多记录 NDEF 消息的复制
- 🛡️ 保持原始数据的完整性和格式
- ⚡ 实时状态反馈和错误处理

### 3. 标签复制
- 📋 一键复制现有 NFC 标签到新标签
- 🔗 支持复杂的支付宝链接结构
- 📊 保留所有元数据和编码信息

## 技术实现

### Web NFC API 支持
```javascript
// 检查浏览器支持
if ('NDEFReader' in window) {
  const ndefReader = new NDEFReader();
  
  // 读取 NFC 标签
  await ndefReader.scan();
  ndefReader.onreading = (event) => {
    // 处理读取的数据
  };
  
  // 写入 NFC 标签
  await ndefReader.write({
    records: [
      { recordType: "text", data: "Hello World" },
      { recordType: "url", data: "https://example.com" }
    ]
  });
}
```

### 数据结构保持
读取时保存完整的记录结构：
```javascript
const records = event.message.records.map(record => ({
  recordType: record.recordType,
  mediaType: record.mediaType,
  id: record.id,
  data: new Uint8Array(record.data.buffer, record.data.byteOffset, record.data.byteLength),
  encoding: record.encoding,
  lang: record.lang
}));
```

## 使用流程

### 标签复制流程
1. **准备阶段**
   - 确保设备支持 NFC 功能
   - 使用 Chrome for Android 89+ 浏览器
   - 准备源标签和目标空白标签

2. **读取源标签**
   - 点击"开始扫描 NFC"按钮
   - 将手机靠近源 NFC 标签（2-4厘米距离）
   - 等待读取成功提示

3. **写入目标标签**
   - 读取成功后，"写入到新标签"按钮会激活
   - 点击写入按钮
   - 将手机靠近空白 NFC 标签
   - 等待写入成功提示

### 支付宝标签处理
- 自动解码支付宝 NFC 链接
- 提取收款码信息
- 生成对应的二维码
- 保持原始链接的完整性

## 浏览器兼容性

| 浏览器 | 版本要求 | NFC 读取 | NFC 写入 | 备注 |
|--------|----------|----------|----------|------|
| Chrome for Android | 89+ | ✅ | ✅ | 完全支持 |
| Firefox for Android | - | ❌ | ❌ | 不支持 |
| Safari iOS | - | ❌ | ❌ | 不支持 |
| Chrome Desktop | - | ❌ | ❌ | 不支持 |

## 安全考虑

### 权限管理
- 需要用户明确授权 NFC 权限
- 只在用户手势触发时执行操作
- 页面必须处于可见状态

### 数据保护
- 所有数据处理在本地完成
- 不上传任何 NFC 数据到服务器
- 支持 HTTPS 安全连接

### 错误处理
- 完善的错误提示和恢复机制
- 防止无效数据写入
- 超时和中断处理

## 测试工具

项目包含专门的 NFC 测试页面：`/nfc-test.html`

### 测试功能
- 浏览器支持检测
- NFC 读取测试
- NFC 写入测试
- 数据复制测试

### 使用方法
1. 在 Android 设备上访问测试页面
2. 按照页面指引进行各项测试
3. 查看详细的调试信息和状态反馈

## 故障排除

### 常见问题
1. **浏览器不支持**
   - 确保使用 Chrome for Android 89+
   - 检查设备是否支持 NFC

2. **读取失败**
   - 确保 NFC 功能已开启
   - 调整手机与标签的距离和角度
   - 尝试不同的 NFC 标签

3. **写入失败**
   - 确保目标标签是空白或可写入的
   - 检查标签容量是否足够
   - 确认标签格式兼容性

### 调试信息
应用提供详细的控制台日志，包括：
- NFC 操作状态
- 数据结构信息
- 错误详情和建议

## 未来扩展

### 计划功能
- 支持更多 NDEF 记录类型
- 批量标签处理
- 标签内容编辑
- 数据导入导出

### 技术改进
- 更好的错误恢复机制
- 性能优化
- 用户体验改进
- 更多浏览器支持（当可用时）

## 参考资源

- [Web NFC API 规范](https://w3c.github.io/web-nfc/)
- [Chrome NFC 文档](https://developer.chrome.com/docs/capabilities/nfc)
- [NDEF 格式说明](https://nfc-forum.org/our-work/specification-releases/)
- [项目 GitHub 仓库](https://github.com/14790897/Ali-NFC2QR)
