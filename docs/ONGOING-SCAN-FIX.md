# NFC "Ongoing Scan" 错误修复

## 问题描述

用户报告遇到以下错误：
```
启动扫描失败: Failed to execute 'scan' on 'NDEFReader': A scan() operation is ongoing.
```

这个错误表示在已有 NFC 扫描操作进行时尝试启动新的扫描操作。

## 问题原因

1. **状态不同步**：UI 状态与实际 NFC 扫描状态不一致
2. **清理不完整**：停止扫描时没有完全清理之前的操作
3. **时序问题**：AbortController 的 abort() 操作需要时间生效
4. **重复点击**：用户快速连续点击扫描按钮

## 修复方案

### 1. 添加重复启动保护

```typescript
const startScanning = async () => {
  if (!ndefReader) return;

  // 防止重复启动
  if (isScanning) {
    console.log("扫描已在进行中，忽略重复启动");
    return;
  }
  
  // ... 其他代码
};
```

### 2. 强制停止之前的扫描

```typescript
// 如果已有扫描在进行，先停止它
if (abortController) {
  console.log("停止之前的扫描操作");
  abortController.abort();
  setAbortController(null);
  // 等待一小段时间确保之前的扫描完全停止
  await new Promise(resolve => setTimeout(resolve, 100));
}
```

### 3. 智能错误处理和自动重试

```typescript
catch (error: any) {
  // 如果是正在进行的扫描错误，尝试强制停止后重试
  if (error.message.includes('ongoing') || error.message.includes('operation is ongoing')) {
    console.log("检测到正在进行的扫描，尝试强制停止后重试");
    setIsScanning(false);
    setAbortController(null);
    
    // 等待更长时间后重试
    setTimeout(() => {
      console.log("重试启动扫描");
      startScanning();
    }, 500);
    return;
  }
  
  // ... 其他错误处理
}
```

### 4. 添加重置功能

```typescript
const resetNFCState = () => {
  console.log("重置NFC状态");
  
  // 停止当前扫描
  if (abortController) {
    abortController.abort();
    setAbortController(null);
  }
  
  // 清理事件监听器
  if (ndefReader) {
    ndefReader.onreading = null;
    ndefReader.onreadingerror = null;
  }
  
  // 重置状态
  setIsScanning(false);
  setError(null);
  setWriteSuccess(null);
  
  console.log("NFC状态已重置");
};
```

### 5. UI 改进

添加了重置按钮，在出现错误或扫描状态时显示：

```tsx
{(error || isScanning) && (
  <Button
    onClick={resetNFCState}
    variant="outline"
    size="sm"
    className="flex items-center gap-2 text-orange-600 hover:text-orange-800"
  >
    <RotateCcw className="w-4 h-4" />
    重置
  </Button>
)}
```

## 修复效果

### 自动修复机制

1. **检测重复启动**：防止在扫描进行时重复点击
2. **强制清理**：启动新扫描前自动停止之前的操作
3. **智能重试**：检测到 ongoing 错误时自动重试
4. **状态同步**：确保 UI 状态与实际扫描状态一致

### 手动修复选项

1. **重置按钮**：用户可以手动重置 NFC 状态
2. **友好提示**：提供更清晰的错误信息
3. **操作指导**：告诉用户如何解决问题

## 测试验证

### 测试场景

1. **正常流程**：
   - 启动扫描 → 停止扫描 → 重新启动扫描
   - 应该无错误

2. **快速点击**：
   - 快速连续点击"开始扫描"按钮
   - 应该忽略重复点击

3. **异常恢复**：
   - 如果出现 ongoing 错误
   - 应该自动重试或显示重置按钮

4. **状态重置**：
   - 点击重置按钮
   - 应该完全清理状态并允许重新开始

### 验证方法

1. **控制台日志**：
   ```
   扫描已在进行中，忽略重复启动
   停止之前的扫描操作
   检测到正在进行的扫描，尝试强制停止后重试
   重置NFC状态
   ```

2. **UI 状态**：
   - 按钮状态正确切换
   - 错误信息清晰显示
   - 重置按钮适时出现

3. **功能测试**：
   - 扫描功能正常工作
   - 停止功能立即生效
   - 重置功能完全清理

## 相关文件

修复涉及以下文件：

1. `components/nfc-reader.tsx` - 主要修复
2. `public/nfc-test.html` - 测试页面同步修复
3. `docs/NFC-TROUBLESHOOTING.md` - 更新故障排除指南
4. `docs/ONGOING-SCAN-FIX.md` - 本修复文档

## 技术要点

### AbortController 时序

- `abort()` 调用是异步的，需要等待生效
- 建议在重新启动前等待 100-500ms
- 监听 AbortError 来确认操作被正确中止

### 状态管理

- UI 状态（isScanning）与实际扫描状态可能不同步
- 需要在所有操作中保持状态一致性
- 错误发生时要正确重置状态

### 错误分类

- `AbortError`：用户主动中止，正常情况
- `ongoing` 错误：重复启动，需要自动处理
- 其他错误：真正的问题，需要显示给用户

## 预防措施

1. **防重复点击**：UI 层面禁用按钮
2. **状态检查**：操作前检查当前状态
3. **自动清理**：组件卸载时清理资源
4. **错误恢复**：提供多种恢复机制

---

*修复完成时间：2024年1月*  
*问题报告：用户反馈*  
*修复者：14790897*  
*测试状态：已验证*
