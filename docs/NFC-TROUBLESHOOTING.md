# NFC 故障排除指南

## 常见错误及解决方案

### 1. 写入错误：mediaType 属性问题

**错误信息：**
```
Failed to execute 'write' on 'NDEFReader': NDEFRecordInit#mediaType is only applicable for 'mime' records.
```

**原因：**
在 Web NFC API 中，`mediaType` 属性只能用于 `mime` 类型的 NDEF 记录。其他类型的记录（如 `text`、`url`）不应包含此属性。

**解决方案：**
- ✅ 已修复：应用现在会根据记录类型自动过滤属性
- 只为 `mime` 类型记录添加 `mediaType`
- 只为 `text` 类型记录添加 `encoding` 和 `lang`

**代码示例：**
```javascript
// ❌ 错误的写法
{
  recordType: "text",
  data: "Hello World",
  mediaType: "text/plain"  // text 类型不应有 mediaType
}

// ✅ 正确的写法
{
  recordType: "text", 
  data: "Hello World",
  encoding: "utf-8",
  lang: "en"
}
```

### 2. 权限相关错误

**错误信息：**
```
NotAllowedError: Permission denied
```

**原因：**
- 用户拒绝了 NFC 权限
- 页面不是 HTTPS 协议
- 不在用户手势触发的上下文中

**解决方案：**
1. 确保使用 HTTPS 协议
2. 在用户点击按钮时触发 NFC 操作
3. 重新授权 NFC 权限：
   - Chrome 设置 → 隐私和安全 → 网站设置 → NFC
   - 找到对应网站，设置为"允许"

### 3. 设备不支持错误

**错误信息：**
```
NotSupportedError: NFC is not supported
```

**原因：**
- 设备不支持 NFC 硬件
- 浏览器不支持 Web NFC API
- NFC 功能被禁用

**解决方案：**
1. 检查设备是否支持 NFC
2. 使用 Chrome for Android 89+ 浏览器
3. 在设备设置中开启 NFC 功能
4. 确保 Chrome 浏览器已更新到最新版本

### 4. NFC 状态错误

**错误信息：**
```
InvalidStateError: NFC operation failed
```

**原因：**
- NFC 功能未开启
- 设备处于飞行模式
- NFC 硬件故障

**解决方案：**
1. 检查 NFC 开关状态
2. 关闭飞行模式
3. 重启设备
4. 尝试其他 NFC 应用验证硬件

### 5. 网络通信错误

**错误信息：**
```
NetworkError: NFC communication failed
```

**原因：**
- NFC 标签损坏或不兼容
- 标签被写保护
- 标签容量不足
- 距离太远或角度不对

**解决方案：**
1. 使用新的空白 NFC 标签
2. 检查标签是否支持写入
3. 调整手机与标签的距离（2-4厘米）
4. 尝试不同的角度和位置
5. 确保标签容量足够存储数据

### 6. 停止扫描问题

**问题：**
点击"停止扫描"按钮后，扫描仍在继续

**原因：**
- 旧版本的应用没有正确实现停止功能
- AbortController 未正确使用

**解决方案：**
- ✅ 已修复：现在使用 AbortController 正确停止扫描
- 点击停止按钮会立即中止 NFC 扫描操作
- 如果仍有问题，请刷新页面重新开始

**技术实现：**
```javascript
// 启动扫描时创建 AbortController
const controller = new AbortController();
await ndefReader.scan({ signal: controller.signal });

// 停止扫描时调用 abort
controller.abort();
```

### 7. 重复扫描错误

**错误信息：**
```
Failed to execute 'scan' on 'NDEFReader': A scan() operation is ongoing.
```

**原因：**
- 尝试在已有扫描操作进行时启动新的扫描
- 之前的扫描操作没有正确停止
- 快速连续点击扫描按钮

**解决方案：**
- ✅ 已修复：应用现在会自动检测并停止之前的扫描
- 启动新扫描前会自动清理之前的操作
- 添加了防重复点击保护
- 提供了"重置"按钮来强制清理状态

**自动修复机制：**
```javascript
// 检测正在进行的扫描错误并自动重试
if (error.message.includes('ongoing')) {
  console.log('检测到正在进行的扫描，尝试强制停止后重试');
  // 停止当前扫描
  abortController.abort();
  // 等待后重试
  setTimeout(() => startScanning(), 500);
}
```

**手动解决：**
1. 点击"重置"按钮（如果可见）
2. 等待几秒后重新尝试
3. 刷新页面重新开始

## 浏览器兼容性检查

### 支持的浏览器
- ✅ Chrome for Android 89+
- ❌ Firefox for Android
- ❌ Safari iOS
- ❌ Chrome Desktop
- ❌ Edge Mobile

### 检查方法
```javascript
// 检查 Web NFC API 支持
if ('NDEFReader' in window) {
  console.log('✅ 支持 Web NFC API');
} else {
  console.log('❌ 不支持 Web NFC API');
}

// 检查设备信息
const userAgent = navigator.userAgent;
const isAndroid = /Android/.test(userAgent);
const isChrome = /Chrome/.test(userAgent);
const chromeVersion = userAgent.match(/Chrome\/(\d+)/)?.[1];

console.log('设备信息:', {
  isAndroid,
  isChrome,
  chromeVersion,
  isSupported: isAndroid && isChrome && parseInt(chromeVersion) >= 89
});
```

## NFC 标签相关问题

### 标签类型兼容性
- ✅ **NTAG213/215/216**：推荐使用
- ✅ **Mifare Classic**：部分支持
- ✅ **Mifare Ultralight**：支持
- ❌ **ISO14443 Type A/B**：可能不支持
- ❌ **FeliCa**：不支持

### 标签容量
- **NTAG213**：180 字节
- **NTAG215**：924 字节  
- **NTAG216**：8192 字节

### 数据格式
支付宝 NFC 链接通常包含：
- URL 记录：包含完整的支付宝链接
- 可能的文本记录：包含描述信息

## 调试技巧

### 1. 开启详细日志
```javascript
// 在浏览器控制台中开启详细日志
localStorage.setItem('nfc-debug', 'true');

// 查看 NFC 操作日志
console.log('NFC 读取记录:', lastReadRecords);
console.log('准备写入的消息:', message);
```

### 2. 使用 NFC 测试页面
访问 `/nfc-test.html` 进行详细的功能测试：
- 浏览器支持检测
- NFC 读取测试
- NFC 写入测试
- 错误信息显示

### 3. 检查记录格式
```javascript
// 验证记录格式
function validateRecord(record) {
  console.log('记录类型:', record.recordType);
  console.log('数据长度:', record.data?.length);
  console.log('媒体类型:', record.mediaType);
  console.log('编码:', record.encoding);
  console.log('语言:', record.lang);
}
```

## 性能优化建议

### 1. 减少数据大小
- 使用简短的 URL
- 避免不必要的元数据
- 压缩文本内容

### 2. 优化读写操作
- 一次性读取所有记录
- 批量写入多个记录
- 避免频繁的读写操作

### 3. 错误恢复
- 实现重试机制
- 提供降级方案
- 友好的错误提示

## 用户指导

### 操作步骤
1. **准备阶段**
   - 确保设备支持 NFC
   - 开启 NFC 功能
   - 使用支持的浏览器

2. **读取操作**
   - 点击"开始扫描 NFC"
   - 将手机背面靠近标签
   - 保持 2-4 厘米距离
   - 等待震动反馈

3. **写入操作**
   - 确保已成功读取数据
   - 点击"写入到新标签"
   - 将手机靠近空白标签
   - 等待写入完成提示

### 注意事项
- 🔋 确保设备电量充足
- 📱 移除手机保护壳可能提高成功率
- 🏷️ 使用质量好的 NFC 标签
- 🔄 操作失败时可重试几次
- 📍 尝试不同的位置和角度

## 联系支持

如果遇到无法解决的问题：

1. **GitHub Issues**：https://github.com/14790897/Ali-NFC2QR/issues
2. **提供信息**：
   - 设备型号和 Android 版本
   - Chrome 浏览器版本
   - 具体错误信息
   - 操作步骤描述
   - NFC 标签类型

3. **日志收集**：
   - 打开浏览器开发者工具
   - 复制控制台中的错误信息
   - 截图错误提示界面

---

*最后更新：2024年1月*  
*维护者：14790897*  
*项目：Ali-NFC2QR*
