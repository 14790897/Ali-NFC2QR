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
      setIsSupported(false)
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
            case 'text':
              const textDecoder = new TextDecoder(record.encoding || 'utf-8')
              data = textDecoder.decode(record.data.buffer)
              break
            case 'url':
              const urlDecoder = new TextDecoder()
              data = urlDecoder.decode(record.data.buffer)
              break
            case 'mime':
              if (record.mediaType === 'text/plain') {
                const mimeDecoder = new TextDecoder()
                data = mimeDecoder.decode(record.data.buffer)
              }
              break
            default:
              // 尝试作为文本解码
              const defaultDecoder = new TextDecoder()
              try {
                data = defaultDecoder.decode(record.data.buffer)
              } catch (e) {
                data = `未知格式数据 (${record.recordType})`
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
              您的浏览器不支持 Web NFC API。请使用 Chrome for Android 89+ 版本。
            </AlertDescription>
          </Alert>
          <div className="mt-4 space-y-2 text-sm text-gray-600">
            <p>• Web NFC 目前仅在 Android 设备上的 Chrome 浏览器中支持</p>
            <p>• 需要 Chrome 89 或更高版本</p>
            <p>• 设备必须支持 NFC 功能</p>
          </div>
        </CardContent>
      </Card>
    )
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
