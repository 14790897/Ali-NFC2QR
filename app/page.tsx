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
      // 首先生成基础二维码
      const qrDataUrl = await QRCode.toDataURL(url, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
        errorCorrectionLevel: "H", // 高纠错级别，允许添加logo
      })

      // 创建canvas来添加支付宝图标
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // 支付宝 SVG 图标
      const alipayLogoSvg = `<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1751696601948" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1624" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M860.16 0C950.272 0 1024 73.889684 1024 164.163368v531.509895s-32.768-4.122947-180.224-53.355789c-40.96-14.362947-96.256-34.896842-157.696-57.478737 36.864-63.595789 65.536-137.485474 86.016-215.444211h-202.752v-71.841684h247.808V256.512h-247.808V135.437474h-100.352c-18.432 0-18.432 18.458947-18.432 18.458947v104.663579H200.704v41.040842h249.856v69.793684H243.712v41.013895H645.12c-14.336 51.307789-34.816 98.519579-57.344 141.608421-129.024-43.115789-268.288-77.985684-356.352-55.403789-55.296 14.362947-92.16 38.992842-112.64 63.595789-96.256 116.978526-26.624 295.504842 176.128 295.504842 120.832 0 237.568-67.718737 327.68-178.526316C757.76 742.858105 1024 853.692632 1024 853.692632v6.144C1024 950.110316 950.272 1024 860.16 1024H163.84C73.728 1024 0 950.137263 0 859.836632V164.163368C0 73.889684 73.728 0 163.84 0h696.32zM268.126316 553.121684c93.049263-10.374737 180.062316 26.974316 283.270737 78.874948-74.886737 95.501474-165.941895 155.701895-256.970106 155.701894-157.830737 0-204.368842-126.652632-125.466947-197.200842 26.300632-22.851368 72.838737-35.301053 99.166316-37.376z" fill="#00A0EA" p-id="1625"></path></svg>`

      // 加载二维码图片
      const qrImage = new Image()
      qrImage.crossOrigin = "anonymous"

      qrImage.onload = () => {
        canvas.width = qrImage.width
        canvas.height = qrImage.height

        // 绘制二维码
        ctx.drawImage(qrImage, 0, 0)

        // 计算中心位置和图标大小
        const centerX = canvas.width / 2
        const centerY = canvas.height / 2
        const iconSize = Math.min(canvas.width, canvas.height) / 5

        // 绘制白色圆形背景
        ctx.fillStyle = "#FFFFFF"
        ctx.beginPath()
        ctx.arc(centerX, centerY, iconSize / 2 + 6, 0, 2 * Math.PI)
        ctx.fill()

        // 创建 SVG 图像
        const svgBlob = new Blob([alipayLogoSvg], { type: "image/svg+xml" })
        const svgUrl = URL.createObjectURL(svgBlob)

        const logoImage = new Image()
        logoImage.crossOrigin = "anonymous"

        logoImage.onload = () => {
          // 绘制支付宝图标
          const logoX = centerX - iconSize / 2
          const logoY = centerY - iconSize / 2

          ctx.drawImage(logoImage, logoX, logoY, iconSize, iconSize)

          // 清理 URL 对象
          URL.revokeObjectURL(svgUrl)

          // 更新二维码显示
          const finalDataUrl = canvas.toDataURL("image/png")
          setQrCodeDataUrl(finalDataUrl)
        }

        logoImage.onerror = () => {
          // 如果 SVG 加载失败，使用备用方案
          console.warn("SVG logo failed to load, using fallback")

          // 绘制支付宝蓝色圆角矩形背景
          const rectSize = iconSize * 0.8
          const cornerRadius = rectSize / 8
          const rectX = centerX - rectSize / 2
          const rectY = centerY - rectSize / 2

          ctx.fillStyle = "#00A0EA" // 支付宝蓝
          ctx.beginPath()
          ctx.roundRect(rectX, rectY, rectSize, rectSize, cornerRadius)
          ctx.fill()

          // 绘制白色"支"字
          ctx.fillStyle = "#FFFFFF"
          ctx.font = `bold ${rectSize * 0.6}px Arial, "Microsoft YaHei", sans-serif`
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText("支", centerX, centerY)

          // 清理 URL 对象
          URL.revokeObjectURL(svgUrl)

          // 更新二维码显示
          const finalDataUrl = canvas.toDataURL("image/png")
          setQrCodeDataUrl(finalDataUrl)
        }

        logoImage.src = svgUrl
      }

      qrImage.src = qrDataUrl
    } catch (error) {
      console.error("生成二维码失败:", error)
      // 如果添加图标失败，至少显示基础二维码
      try {
        const basicQrDataUrl = await QRCode.toDataURL(url, {
          width: 300,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
          errorCorrectionLevel: "H",
        })
        setQrCodeDataUrl(basicQrDataUrl)
      } catch (basicError) {
        console.error("生成基础二维码也失败:", basicError)
      }
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
