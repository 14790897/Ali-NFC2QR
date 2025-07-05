# NFC 数据格式错误修复

## 问题描述

用户报告遇到以下错误：
```
写入失败: Failed to execute 'write' on 'NDEFReader': The data for url NDEFRecord must be a String.
```

这个错误表明 URL 类型的 NDEF 记录需要字符串数据，但我们传递的是 Uint8Array。

## 问题原因

### 数据格式要求

Web NFC API 对不同类型的 NDEF 记录有特定的数据格式要求：

1. **URL 记录**：`data` 必须是字符串
2. **文本记录**：`data` 必须是字符串
3. **MIME 记录**：`data` 可以是 Uint8Array 或字符串

### 读取与写入的差异

- **读取时**：所有数据都以 `DataView` 形式返回，我们转换为 `Uint8Array` 保存
- **写入时**：不同类型需要不同的数据格式

## 修复方案

### 1. 智能数据格式转换

```typescript
const validateAndCleanRecord = (record: any) => {
  const cleanRecord: any = {
    recordType: record.recordType,
  };

  // 根据记录类型处理数据格式
  switch (record.recordType) {
    case "text":
      // 文本记录需要字符串数据
      if (record.data instanceof Uint8Array) {
        const textDecoder = new TextDecoder(record.encoding || "utf-8");
        cleanRecord.data = textDecoder.decode(record.data);
      } else {
        cleanRecord.data = record.data;
      }
      
      if (record.encoding) {
        cleanRecord.encoding = record.encoding;
      }
      if (record.lang) {
        cleanRecord.lang = record.lang;
      }
      break;

    case "url":
    case "absolute-url":
      // URL 记录必须是字符串数据
      if (record.data instanceof Uint8Array) {
        const urlDecoder = new TextDecoder();
        cleanRecord.data = urlDecoder.decode(record.data);
      } else {
        cleanRecord.data = record.data;
      }
      break;

    case "mime":
      // MIME 记录保持原始数据格式
      cleanRecord.data = record.data;
      if (record.mediaType) {
        cleanRecord.mediaType = record.mediaType;
      }
      break;

    default:
      // 对于未知类型，尝试转换为字符串
      if (record.data instanceof Uint8Array) {
        try {
          const decoder = new TextDecoder();
          cleanRecord.data = decoder.decode(record.data);
        } catch (e) {
          // 如果无法解码为文本，保持原始数据
          cleanRecord.data = record.data;
        }
      } else {
        cleanRecord.data = record.data;
      }
  }

  return cleanRecord;
};
```

### 2. 数据格式验证

```typescript
// 验证数据格式是否正确
const validateDataFormat = (record: any) => {
  switch (record.recordType) {
    case "url":
    case "absolute-url":
      if (typeof record.data !== "string") {
        throw new Error(`URL 记录的数据必须是字符串，当前类型：${typeof record.data}`);
      }
      break;
      
    case "text":
      if (typeof record.data !== "string") {
        throw new Error(`文本记录的数据必须是字符串，当前类型：${typeof record.data}`);
      }
      break;
      
    case "mime":
      // MIME 记录可以是多种格式
      break;
  }
};
```

## 修复效果

### 修复前的问题

```javascript
// ❌ 错误：URL 记录使用 Uint8Array
{
  recordType: "url",
  data: new Uint8Array([104, 116, 116, 112, 115, ...])  // 会导致错误
}
```

### 修复后的结果

```javascript
// ✅ 正确：URL 记录使用字符串
{
  recordType: "url", 
  data: "https://qr.alipay.com/..."  // 正确格式
}
```

## 支持的记录类型

### 1. URL 记录

```javascript
{
  recordType: "url",
  data: "https://example.com"  // 必须是字符串
}
```

### 2. 文本记录

```javascript
{
  recordType: "text",
  data: "Hello World",  // 必须是字符串
  encoding: "utf-8",    // 可选
  lang: "en"           // 可选
}
```

### 3. MIME 记录

```javascript
{
  recordType: "mime",
  data: new Uint8Array([...]),  // 可以是 Uint8Array
  mediaType: "application/json" // 必需
}
```

### 4. 绝对 URL 记录

```javascript
{
  recordType: "absolute-url",
  data: "https://example.com"  // 必须是字符串
}
```

## 测试验证

### 测试用例

1. **URL 记录测试**
   ```javascript
   const urlRecord = {
     recordType: "url",
     data: new Uint8Array([104, 116, 116, 112, 115, 58, 47, 47])
   };
   
   const cleaned = validateAndCleanRecord(urlRecord);
   console.log(cleaned.data); // "https://"
   ```

2. **文本记录测试**
   ```javascript
   const textRecord = {
     recordType: "text",
     data: new Uint8Array([72, 101, 108, 108, 111]),
     encoding: "utf-8"
   };
   
   const cleaned = validateAndCleanRecord(textRecord);
   console.log(cleaned.data); // "Hello"
   ```

### 验证方法

1. **控制台日志**：查看 "清理后的记录" 日志
2. **数据类型检查**：确认 `data` 字段的类型
3. **写入测试**：验证写入操作不再报错

## 相关文件

修复涉及以下文件：

1. `components/nfc-reader.tsx` - 主要修复
2. `public/nfc-test.html` - 测试页面同步修复
3. `docs/NFC-TROUBLESHOOTING.md` - 更新故障排除指南
4. `docs/DATA-FORMAT-FIX.md` - 本修复文档

## 注意事项

### 编码处理

- 文本记录使用指定的编码（默认 UTF-8）
- URL 记录使用 UTF-8 编码
- 确保编码与原始数据匹配

### 错误处理

- 如果无法解码为文本，保持原始数据
- 提供详细的错误信息
- 记录调试日志便于排查

### 兼容性

- 支持所有标准 NDEF 记录类型
- 向后兼容现有数据
- 处理未知记录类型

---

*修复完成时间：2024年1月*  
*问题报告：用户反馈*  
*修复者：14790897*  
*测试状态：已验证*
