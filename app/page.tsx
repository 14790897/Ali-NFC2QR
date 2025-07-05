"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, Download, QrCode, Link, AlertCircle, CheckCircle } from "lucide-react"
import QRCode from "qrcode"

interface DecodeResult {
  originalLink: string
  paymentCode: string
  success: boolean
  error?: string
}

export default function AlipayNFCDecoder() {
  const [inputUrl, setInputUrl] = useState("")
  const [decodeResult, setDecodeResult] = useState<DecodeResult | null>(null)
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const extractAlipayScheme = (url: string): DecodeResult => {
    try {
      // 解析整个 URL，获取 query 参数部分
      const urlObj = new URL(url)
      const schemeParam = urlObj.searchParams.get("scheme")

      if (!schemeParam) {
        return {
          originalLink: "",
          paymentCode: "",
          success: false,
          error: "未找到 scheme 参数",
        }
      }

      // 第一次 URL 解码
      const firstDecode = decodeURIComponent(schemeParam)
      console.log("第一次解码后的 scheme:", firstDecode)

      // 第二次 URL 解码
      const secondDecode = decodeURIComponent(firstDecode)

      // 提取收款码
      const paymentCode = extractPaymentCode(secondDecode)

      return {
        originalLink: secondDecode,
        paymentCode,
        success: true,
      }
    } catch (error) {
      return {
        originalLink: "",
        paymentCode: "",
        success: false,
        error: "解析URL时发生错误",
      }
    }
  }

  const extractPaymentCode = (schemeUrl: string): string => {
    try {
      if (!schemeUrl.includes("?")) {
        return "未找到收款码"
      }

      const [, queryPart] = schemeUrl.split("?", 2)
      const params = new URLSearchParams(queryPart)
      const codeContent = params.get("codeContent")

      if (!codeContent) {
        return "未找到收款码"
      }

      const paymentUrl = codeContent

      // 移除 noT 参数
      if (paymentUrl.includes("?")) {
        const [baseUrl, query] = paymentUrl.split("?", 2)
        const queryParams = new URLSearchParams(query)

        // 移除 noT 参数
        queryParams.delete("noT")

        // 重新构建 URL
        if (queryParams.toString()) {
          return `${baseUrl}?${queryParams.toString()}`
        } else {
          return baseUrl
        }
      }

      return paymentUrl
    } catch (error) {
      return "未找到收款码"
    }
  }

  const generateQRCode = async (url: string) => {
    try {
      const qrDataUrl = await QRCode.toDataURL(url, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
        errorCorrectionLevel: "H",
      })
      setQrCodeDataUrl(qrDataUrl)
    } catch (error) {
      console.error("生成二维码失败:", error)
    }
  }

  const handleDecode = async () => {
    if (!inputUrl.trim()) {
      return
    }

    setIsLoading(true)
    const result = extractAlipayScheme(inputUrl.trim())
    setDecodeResult(result)

    if (result.success && result.paymentCode && result.paymentCode !== "未找到收款码") {
      await generateQRCode(result.paymentCode)
    } else {
      setQrCodeDataUrl("")
    }

    setIsLoading(false)
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (error) {
      console.error("复制失败:", error)
    }
  }

  const downloadQRCode = () => {
    if (!qrCodeDataUrl) return

    const link = document.createElement("a")
    link.download = "alipay-qr-code.png"
    link.href = qrCodeDataUrl
    link.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">支付宝 NFC 链接解码器</h1>
          <p className="text-gray-600">解码支付宝 NFC 链接并生成二维码</p>
        </div>

        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="w-5 h-5" />
              输入 NFC 链接
            </CardTitle>
            <CardDescription>请输入完整的支付宝 NFC 链接进行解码</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nfc-url">NFC 链接</Label>
              <Textarea
                id="nfc-url"
                placeholder="https://render.alipay.com/p/s/ulink/sn?s=dc&scheme=..."
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>
            <Button onClick={handleDecode} disabled={!inputUrl.trim() || isLoading} className="w-full">
              {isLoading ? "解码中..." : "开始解码"}
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        {decodeResult && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Decode Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {decodeResult.success ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                  解码结果
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {decodeResult.success ? (
                  <>
                    <div className="space-y-2">
                      <Label>原始链接</Label>
                      <div className="flex gap-2">
                        <Input value={decodeResult.originalLink} readOnly className="text-sm" />
                        <Button size="sm" variant="outline" onClick={() => copyToClipboard(decodeResult.originalLink)}>
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>收款码</Label>
                      <div className="flex gap-2">
                        <Input value={decodeResult.paymentCode} readOnly className="text-sm" />
                        <Button size="sm" variant="outline" onClick={() => copyToClipboard(decodeResult.paymentCode)}>
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{decodeResult.error || "解码失败"}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* QR Code */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="w-5 h-5" />
                  二维码
                </CardTitle>
              </CardHeader>
              <CardContent>
                {qrCodeDataUrl ? (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className="p-4 bg-white rounded-lg shadow-sm border">
                        <img src={qrCodeDataUrl || "/placeholder.svg"} alt="支付宝收款二维码" className="w-64 h-64" />
                      </div>
                    </div>
                    <Button onClick={downloadQRCode} variant="outline" className="w-full bg-transparent">
                      <Download className="w-4 h-4 mr-2" />
                      下载二维码
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 text-gray-500">
                    <div className="text-center">
                      <QrCode className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>解码成功后将显示二维码</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>使用说明</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-600">
            <p>1. 将完整的支付宝 NFC 链接粘贴到输入框中</p>
            <p>2. 点击"开始解码"按钮进行解析</p>
            <p>3. 系统将自动提取原始链接和收款码</p>
            <p>4. 如果解码成功，将自动生成对应的二维码</p>
            <p>5. 可以复制链接或下载二维码图片</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
