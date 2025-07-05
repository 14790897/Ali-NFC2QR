"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Smartphone,
  Wifi,
  WifiOff,
  AlertCircle,
  CheckCircle,
  Scan,
  Edit,
  Copy,
  RotateCcw,
} from "lucide-react";

interface NFCReadingEvent extends Event {
  serialNumber: string;
  message: {
    records: Array<{
      recordType: string;
      mediaType?: string;
      id?: string;
      data: DataView;
      encoding?: string;
      lang?: string;
    }>;
  };
}

interface NFCReader {
  scan(options?: { signal?: AbortSignal }): Promise<void>;
  write(
    message: any,
    options?: { overwrite?: boolean; signal?: AbortSignal }
  ): Promise<void>;
  makeReadOnly(options?: { signal?: AbortSignal }): Promise<void>;
  onreading: ((event: NFCReadingEvent) => void) | null;
  onreadingerror: ((event: Event) => void) | null;
}

declare global {
  interface Window {
    NDEFReader: {
      new (): NFCReader;
    };
  }
}

interface NFCReaderProps {
  onNFCRead?: (url: string) => void;
}

export default function NFCReaderComponent({ onNFCRead }: NFCReaderProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isWriting, setIsWriting] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [lastReadData, setLastReadData] = useState<string | null>(null);
  const [lastReadRecords, setLastReadRecords] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [writeSuccess, setWriteSuccess] = useState<string | null>(null);
  const [ndefReader, setNdefReader] = useState<NFCReader | null>(null);
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);

  useEffect(() => {
    // 检查浏览器支持
    if ("NDEFReader" in window) {
      setIsSupported(true);
      setNdefReader(new window.NDEFReader());
    } else {
      setIsSupported(false);
      // 详细检查不支持的原因
      console.log("Web NFC 不支持检查:");
      console.log("User Agent:", navigator.userAgent);
      console.log("Platform:", navigator.platform);
      console.log("Is Chrome:", /Chrome/.test(navigator.userAgent));
      console.log("Is Android:", /Android/.test(navigator.userAgent));
    }

    // 检查权限状态
    checkPermission();

    // 清理函数：组件卸载时停止扫描
    return () => {
      if (abortController) {
        abortController.abort();
      }
    };
  }, []);

  const checkPermission = async () => {
    try {
      if ("permissions" in navigator) {
        const permissionStatus = await navigator.permissions.query({
          name: "nfc" as PermissionName,
        });
        setHasPermission(permissionStatus.state === "granted");

        permissionStatus.onchange = () => {
          setHasPermission(permissionStatus.state === "granted");
        };
      }
    } catch (error) {
      console.log("无法检查NFC权限状态:", error);
    }
  };

  // 验证和清理 NDEF 记录
  const validateAndCleanRecord = (record: any) => {
    const cleanRecord: any = {
      recordType: record.recordType,
      data: record.data,
    };

    // 验证必需字段
    if (!record.recordType) {
      throw new Error("记录缺少 recordType 字段");
    }

    if (!record.data) {
      throw new Error("记录缺少 data 字段");
    }

    // 根据记录类型添加相应属性
    switch (record.recordType) {
      case "text":
        if (record.encoding) {
          cleanRecord.encoding = record.encoding;
        }
        if (record.lang) {
          cleanRecord.lang = record.lang;
        }
        break;

      case "mime":
        if (record.mediaType) {
          cleanRecord.mediaType = record.mediaType;
        }
        break;

      case "url":
      case "absolute-url":
        // URL 记录不需要额外属性
        break;

      default:
        console.log(`处理未知记录类型: ${record.recordType}`);
    }

    // 添加 ID（如果存在）
    if (record.id) {
      cleanRecord.id = record.id;
    }

    return cleanRecord;
  };

  const checkNFCSettings = () => {
    const checks = {
      isAndroid: /Android/.test(navigator.userAgent),
      isChrome: /Chrome/.test(navigator.userAgent),
      isHTTPS:
        location.protocol === "https:" || location.hostname === "localhost",
      hasNDEF: "NDEFReader" in window,
    };

    console.group("NFC 环境检查");
    console.log("Android 设备:", checks.isAndroid);
    console.log("Chrome 浏览器:", checks.isChrome);
    console.log("HTTPS 协议:", checks.isHTTPS);
    console.log("NDEFReader 可用:", checks.hasNDEF);
    console.log("User Agent:", navigator.userAgent);
    console.groupEnd();

    return checks;
  };

  const startScanning = async () => {
    if (!ndefReader) return;

    // 防止重复启动
    if (isScanning) {
      console.log("扫描已在进行中，忽略重复启动");
      return;
    }

    try {
      setError(null);

      // 如果已有扫描在进行，先停止它
      if (abortController) {
        console.log("停止之前的扫描操作");
        abortController.abort();
        setAbortController(null);
        // 等待一小段时间确保之前的扫描完全停止
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      setIsScanning(true);

      // 创建新的 AbortController
      const controller = new AbortController();
      setAbortController(controller);

      await ndefReader.scan({ signal: controller.signal });
      console.log("NFC扫描已开始");

      ndefReader.onreading = (event: NFCReadingEvent) => {
        console.log("检测到NFC标签:", event);

        // 保存完整的记录数据用于写入
        const records = event.message.records.map((record) => ({
          recordType: record.recordType,
          mediaType: record.mediaType,
          id: record.id,
          data: new Uint8Array(
            record.data.buffer,
            record.data.byteOffset,
            record.data.byteLength
          ),
          encoding: record.encoding,
          lang: record.lang,
        }));
        setLastReadRecords(records);

        // 处理读取到的数据
        for (const record of event.message.records) {
          let data = "";

          switch (record.recordType) {
            case "text":
              const textDecoder = new TextDecoder(record.encoding || "utf-8");
              // 修复 TypeScript 错误：正确处理 DataView
              const textBytes = new Uint8Array(
                record.data.buffer,
                record.data.byteOffset,
                record.data.byteLength
              );
              data = textDecoder.decode(textBytes);
              break;
            case "url":
              const urlDecoder = new TextDecoder();
              const urlBytes = new Uint8Array(
                record.data.buffer,
                record.data.byteOffset,
                record.data.byteLength
              );
              data = urlDecoder.decode(urlBytes);
              break;
            case "mime":
              if (record.mediaType === "text/plain") {
                const mimeDecoder = new TextDecoder();
                const mimeBytes = new Uint8Array(
                  record.data.buffer,
                  record.data.byteOffset,
                  record.data.byteLength
                );
                data = mimeDecoder.decode(mimeBytes);
              }
              break;
            default:
              // 尝试作为文本解码
              const defaultDecoder = new TextDecoder();
              try {
                const defaultBytes = new Uint8Array(
                  record.data.buffer,
                  record.data.byteOffset,
                  record.data.byteLength
                );
                data = defaultDecoder.decode(defaultBytes);
              } catch (e) {
                data = `未知格式数据 (${record.recordType})`;
              }
          }

          if (data) {
            setLastReadData(data);
            if (onNFCRead) {
              onNFCRead(data);
            }
            break; // 只处理第一个有效记录
          }
        }
      };

      ndefReader.onreadingerror = (event: Event) => {
        console.error("NFC读取错误:", event);
        setError("无法读取NFC标签数据，请尝试其他标签");
      };

      setHasPermission(true);
    } catch (error: any) {
      console.error("启动NFC扫描失败:", error);

      // 如果是用户主动中止，不显示错误
      if (error.name === "AbortError") {
        console.log("NFC扫描被用户中止");
        setIsScanning(false);
        return;
      }

      // 如果是正在进行的扫描错误，尝试强制停止后重试
      if (
        error.message.includes("ongoing") ||
        error.message.includes("operation is ongoing")
      ) {
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

      let errorMessage = `启动扫描失败: ${error.message}`;

      // 提供更友好的错误提示
      if (error.message.includes("NotAllowedError")) {
        errorMessage = "启动扫描失败: 权限被拒绝，请确保已授权 NFC 权限";
      } else if (error.message.includes("NotSupportedError")) {
        errorMessage = "启动扫描失败: 设备不支持 NFC 功能";
      } else if (error.message.includes("InvalidStateError")) {
        errorMessage = "启动扫描失败: NFC 状态无效，请检查 NFC 是否已开启";
      }

      setError(errorMessage);
      setIsScanning(false);
      setAbortController(null);
    }
  };

  // 重置 NFC 状态
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

  const stopScanning = () => {
    console.log("停止NFC扫描");

    // 使用 AbortController 停止扫描
    if (abortController) {
      abortController.abort();
      setAbortController(null);
      console.log("已发送停止信号");
    }

    // 清理事件监听器
    if (ndefReader) {
      ndefReader.onreading = null;
      ndefReader.onreadingerror = null;
    }

    setIsScanning(false);
    setError(null);
    console.log("NFC扫描已停止");
  };

  const writeToNFC = async () => {
    if (!ndefReader || !lastReadRecords.length) return;

    try {
      setError(null);
      setWriteSuccess(null);
      setIsWriting(true);

      // 构建NDEF消息，使用验证函数清理记录
      const message = {
        records: lastReadRecords.map((record) =>
          validateAndCleanRecord(record)
        ),
      };

      console.log("准备写入的NDEF消息:", message);
      console.log("原始记录数据:", lastReadRecords);

      await ndefReader.write(message);
      setWriteSuccess("数据已成功写入到NFC标签！");
      console.log("NFC写入成功");
    } catch (error: any) {
      console.error("NFC写入失败:", error);
      console.error("错误详情:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });

      let errorMessage = `写入失败: ${error.message}`;

      // 提供更友好的错误提示
      if (error.message.includes("mediaType")) {
        errorMessage =
          "写入失败: 记录格式错误，mediaType 属性只能用于 MIME 类型记录";
      } else if (error.message.includes("NotAllowedError")) {
        errorMessage = "写入失败: 权限被拒绝，请确保已授权 NFC 权限";
      } else if (error.message.includes("NotSupportedError")) {
        errorMessage = "写入失败: 设备不支持 NFC 写入功能";
      } else if (error.message.includes("InvalidStateError")) {
        errorMessage = "写入失败: NFC 状态无效，请重新尝试";
      } else if (error.message.includes("NetworkError")) {
        errorMessage = "写入失败: NFC 通信错误，请检查标签是否可写入";
      }

      setError(errorMessage);
    } finally {
      setIsWriting(false);
    }
  };

  if (!isSupported) {
    const isAndroid = /Android/.test(navigator.userAgent);
    const isChrome = /Chrome/.test(navigator.userAgent);
    const chromeVersion = navigator.userAgent.match(/Chrome\/(\d+)/);
    const chromeVersionNumber = chromeVersion ? parseInt(chromeVersion[1]) : 0;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <WifiOff className="w-5 h-5 text-red-500" />
            NFC 不支持
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              您的浏览器不支持 Web NFC API。请检查以下要求：
            </AlertDescription>
          </Alert>

          <div className="mt-4 space-y-3">
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-2">当前环境检测：</h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>操作系统：</span>
                  <span
                    className={isAndroid ? "text-green-600" : "text-red-600"}
                  >
                    {isAndroid ? "✓ Android" : "✗ 非 Android"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>浏览器：</span>
                  <span
                    className={isChrome ? "text-green-600" : "text-red-600"}
                  >
                    {isChrome ? "✓ Chrome" : "✗ 非 Chrome"}
                  </span>
                </div>
                {isChrome && (
                  <div className="flex justify-between">
                    <span>Chrome 版本：</span>
                    <span
                      className={
                        chromeVersionNumber >= 89
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {chromeVersionNumber >= 89 ? "✓" : "✗"}{" "}
                      {chromeVersionNumber}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <p className="font-medium text-gray-800">Web NFC 支持要求：</p>
              <ul className="space-y-1 ml-4 text-gray-600">
                <li className={isAndroid ? "text-green-600" : "text-red-600"}>
                  • {isAndroid ? "✓" : "✗"} Android 操作系统
                </li>
                <li className={isChrome ? "text-green-600" : "text-red-600"}>
                  • {isChrome ? "✓" : "✗"} Chrome 浏览器
                </li>
                <li
                  className={
                    chromeVersionNumber >= 89
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  • {chromeVersionNumber >= 89 ? "✓" : "✗"} Chrome 版本 89+
                </li>
                <li>• 设备必须支持 NFC 硬件功能</li>
                <li>• 系统设置中需要开启 NFC</li>
              </ul>
            </div>

            {!isAndroid && (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  <strong>您当前使用的不是 Android 设备。</strong>
                  <br />
                  Web NFC API 目前仅在 Android 设备上支持，iOS
                  和桌面平台暂不支持。
                </AlertDescription>
              </Alert>
            )}

            {isAndroid && !isChrome && (
              <Alert className="border-blue-200 bg-blue-50">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>请使用 Chrome 浏览器。</strong>
                  <br />
                  请安装或打开 Chrome 浏览器来使用 NFC 功能。
                </AlertDescription>
              </Alert>
            )}

            {isAndroid && isChrome && chromeVersionNumber < 89 && (
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  <strong>Chrome 版本过低。</strong>
                  <br />
                  请将 Chrome 更新到 89 或更高版本。当前版本：
                  {chromeVersionNumber}
                </AlertDescription>
              </Alert>
            )}

            {isAndroid && isChrome && chromeVersionNumber >= 89 && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <strong>可能的问题：</strong>
                  <br />
                  • 设备的 NFC 硬件不支持或已损坏
                  <br />
                  • 系统设置中 NFC 功能未开启
                  <br />
                  • Chrome 的实验性功能未启用
                  <br />• 当前网页不是通过 HTTPS 访问
                </AlertDescription>
              </Alert>
            )}

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-sm mb-2 text-blue-800">
                解决步骤：
              </h4>
              <ol className="space-y-1 text-xs text-blue-700 ml-4 list-decimal">
                <li>确认使用 Android 设备</li>
                <li>安装最新版本的 Chrome 浏览器</li>
                <li>在设置中开启 NFC 功能</li>
                <li>确保网站通过 HTTPS 访问</li>
                <li>
                  如仍不支持，尝试在 Chrome 地址栏输入 chrome://flags 启用实验性
                  Web Platform 功能
                </li>
              </ol>

              <Button
                onClick={() => {
                  checkNFCSettings();
                  alert("请查看浏览器控制台（F12）的详细检查结果");
                }}
                variant="outline"
                size="sm"
                className="mt-3"
              >
                运行环境诊断
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="w-5 h-5" />
          NFC 读取器
          {isScanning && (
            <Badge variant="secondary" className="ml-2">
              扫描中
            </Badge>
          )}
        </CardTitle>
        <CardDescription>将手机靠近 NFC 标签以读取内容</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {lastReadData && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="font-medium">读取成功！</div>
              <div className="mt-1 text-sm break-all">{lastReadData}</div>
              {lastReadRecords.length > 0 && (
                <div className="mt-2 text-xs text-gray-500">
                  已保存 {lastReadRecords.length} 条记录，可写入到其他NFC标签
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        {writeSuccess && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="font-medium">{writeSuccess}</div>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex flex-wrap gap-2">
          {!isScanning ? (
            <Button onClick={startScanning} className="flex items-center gap-2">
              <Scan className="w-4 h-4" />
              开始扫描 NFC
            </Button>
          ) : (
            <Button
              onClick={stopScanning}
              variant="outline"
              className="flex items-center gap-2"
            >
              <WifiOff className="w-4 h-4" />
              停止扫描
            </Button>
          )}

          {lastReadRecords.length > 0 && (
            <Button
              onClick={writeToNFC}
              disabled={isWriting || isScanning}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              {isWriting ? "写入中..." : "写入到新标签"}
            </Button>
          )}

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
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <p className="font-medium">使用说明：</p>
          <ul className="space-y-1 ml-4">
            <li>• 确保设备已开启 NFC 功能</li>
            <li>
              • <strong>读取：</strong>点击"开始扫描
              NFC"，将手机靠近标签（2-4厘米）
            </li>
            <li>
              • <strong>写入：</strong>读取成功后，点击"写入到新标签"按钮
            </li>
            <li>
              • <strong>写入：</strong>将手机靠近要写入的空白NFC标签
            </li>
            <li>• 等待震动反馈，表示操作成功</li>
          </ul>
        </div>

        {hasPermission === false && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              需要 NFC 权限才能使用此功能。点击扫描按钮时会提示授权。
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
