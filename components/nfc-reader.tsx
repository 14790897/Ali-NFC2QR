"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Smartphone, Wifi, WifiOff, AlertCircle, CheckCircle, Scan } from "lucide-react"

interface NFCReadingEvent extends Event {
  serialNumber: string
  message: {
    records: Array<{
      recordType: string
      mediaType?: string
      id?: string
      data: DataView
      encoding?: string
      lang?: string
    }>
  }
}

interface NFCReader {
  scan(options?: { signal?: AbortSignal }): Promise<void>
  write(message: any, options?: { overwrite?: boolean; signal?: AbortSignal }): Promise<void>
  makeReadOnly(options?: { signal?: AbortSignal }): Promise<void>
  onreading: ((event: NFCReadingEvent) => void) | null
  onreadingerror: ((event: Event) => void) | null
}

declare global {
  interface Window {
    NDEFReader: {
      new(): NFCReader
    }
  }
}

interface NFCReaderProps {
  onNFCRead?: (url: string) => void
}

export default function NFCReaderComponent({ onNFCRead }: NFCReaderProps) {
  const [isSupported, setIsSupported] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [lastReadData, setLastReadData] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [ndefReader, setNdefReader] = useState<NFCReader | null>(null)

  useEffect(() => {
    // 检查浏览器支持
    if ('NDEFReader' in window) {
      setIsSupported(true)
      setNdefReader(new window.NDEFReader())
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
    checkPermission()
  }, [])

  const checkPermission = async () => {
    try {
      if ('permissions' in navigator) {
        const permissionStatus = await navigator.permissions.query({ name: 'nfc' as PermissionName })
        setHasPermission(permissionStatus.state === 'granted')
        
        permissionStatus.onchange = () => {
          setHasPermission(permissionStatus.state === 'granted')
        }
      }
    } catch (error) {
      console.log('无法检查NFC权限状态:', error)
    }
  }

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
    if (!ndefReader) return

    try {
      setError(null)
      setIsScanning(true)

      await ndefReader.scan()
      console.log('NFC扫描已开始')

      ndefReader.onreading = (event: NFCReadingEvent) => {
        console.log('检测到NFC标签:', event)
        
        // 处理读取到的数据
        for (const record of event.message.records) {
          let data = ''
          
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
            setLastReadData(data)
            if (onNFCRead) {
              onNFCRead(data)
            }
            break // 只处理第一个有效记录
          }
        }
      }

      ndefReader.onreadingerror = (event: Event) => {
        console.error('NFC读取错误:', event)
        setError('无法读取NFC标签数据，请尝试其他标签')
      }

      setHasPermission(true)
    } catch (error: any) {
      console.error('启动NFC扫描失败:', error)
      setError(`启动扫描失败: ${error.message}`)
      setIsScanning(false)
    }
  }

  const stopScanning = () => {
    setIsScanning(false)
    if (ndefReader) {
      ndefReader.onreading = null
      ndefReader.onreadingerror = null
    }
  }

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
          {isScanning && <Badge variant="secondary" className="ml-2">扫描中</Badge>}
        </CardTitle>
        <CardDescription>
          将手机靠近 NFC 标签以读取内容
        </CardDescription>
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
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2">
          {!isScanning ? (
            <Button onClick={startScanning} className="flex items-center gap-2">
              <Scan className="w-4 h-4" />
              开始扫描 NFC
            </Button>
          ) : (
            <Button onClick={stopScanning} variant="outline" className="flex items-center gap-2">
              <WifiOff className="w-4 h-4" />
              停止扫描
            </Button>
          )}
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <p className="font-medium">使用说明：</p>
          <ul className="space-y-1 ml-4">
            <li>• 确保设备已开启 NFC 功能</li>
            <li>• 点击"开始扫描 NFC"按钮</li>
            <li>• 将手机背面靠近 NFC 标签（距离 2-4 厘米）</li>
            <li>• 等待震动反馈，表示读取成功</li>
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
  )
}
