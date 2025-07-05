"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Copy,
  Download,
  QrCode,
  Link,
  AlertCircle,
  CheckCircle,
  Github,
  ExternalLink,
} from "lucide-react";
import QRCode from "qrcode";
import NFCReaderComponent from "@/components/nfc-reader";
import StructuredData from "@/components/structured-data";

interface DecodeResult {
  originalLink: string;
  paymentCode: string;
  success: boolean;
  error?: string;
}

export default function AlipayNFCDecoder() {
  const [inputUrl, setInputUrl] = useState("");
  const [decodeResult, setDecodeResult] = useState<DecodeResult | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const extractAlipayScheme = (url: string): DecodeResult => {
    try {
      // 解析整个 URL，获取 query 参数部分
      const urlObj = new URL(url);
      const schemeParam = urlObj.searchParams.get("scheme");

      if (!schemeParam) {
        return {
          originalLink: "",
          paymentCode: "",
          success: false,
          error: "未找到 scheme 参数",
        };
      }

      // 第一次 URL 解码
      const firstDecode = decodeURIComponent(schemeParam);
      console.log("第一次解码后的 scheme:", firstDecode);

      // 第二次 URL 解码
      const secondDecode = decodeURIComponent(firstDecode);

      // 提取收款码
      const paymentCode = extractPaymentCode(secondDecode);

      return {
        originalLink: secondDecode,
        paymentCode,
        success: true,
      };
    } catch (error) {
      return {
        originalLink: "",
        paymentCode: "",
        success: false,
        error: "解析URL时发生错误",
      };
    }
  };

  const extractPaymentCode = (schemeUrl: string): string => {
    try {
      if (!schemeUrl.includes("?")) {
        return "未找到收款码";
      }

      const [, queryPart] = schemeUrl.split("?", 2);
      const params = new URLSearchParams(queryPart);
      const codeContent = params.get("codeContent");

      if (!codeContent) {
        return "未找到收款码";
      }

      const paymentUrl = codeContent;

      // 移除 noT 参数
      if (paymentUrl.includes("?")) {
        const [baseUrl, query] = paymentUrl.split("?", 2);
        const queryParams = new URLSearchParams(query);

        // 移除 noT 参数
        queryParams.delete("noT");

        // 重新构建 URL
        if (queryParams.toString()) {
          return `${baseUrl}?${queryParams.toString()}`;
        } else {
          return baseUrl;
        }
      }

      return paymentUrl;
    } catch (error) {
      return "未找到收款码";
    }
  };

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
      });

      // 创建canvas来添加支付宝图标
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // 支付宝 SVG 图标 - 使用本地文件
      const alipayLogoSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bgGradient" cx="0.3" cy="0.3" r="0.8">
      <stop offset="0%" stop-color="#1890FF"/>
      <stop offset="100%" stop-color="#00A0EA"/>
    </radialGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.3"/>
    </filter>
  </defs>
  <circle cx="100" cy="100" r="95" fill="url(#bgGradient)" filter="url(#shadow)"/>
  <g transform="translate(100, 100)" fill="white">
    <rect x="-40" y="-30" width="80" height="8" rx="4"/>
    <rect x="-35" y="-8" width="70" height="8" rx="4"/>
    <rect x="-40" y="14" width="80" height="8" rx="4"/>
    <rect x="-35" y="-30" width="8" height="52" rx="4"/>
    <rect x="27" y="-30" width="8" height="52" rx="4"/>
    <path d="M-20,30 Q0,45 20,30" stroke="white" stroke-width="6" fill="none" stroke-linecap="round"/>
  </g>
  <circle cx="100" cy="100" r="90" fill="none" stroke="white" stroke-width="1" opacity="0.4"/>
</svg>`;

      // 加载二维码图片
      const qrImage = new Image();
      qrImage.crossOrigin = "anonymous";

      qrImage.onload = () => {
        canvas.width = qrImage.width;
        canvas.height = qrImage.height;

        // 绘制二维码
        ctx.drawImage(qrImage, 0, 0);

        // 计算中心位置和图标大小
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const iconSize = Math.min(canvas.width, canvas.height) / 5;

        // 绘制白色圆形背景
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(centerX, centerY, iconSize / 2 + 6, 0, 2 * Math.PI);
        ctx.fill();

        // 创建 SVG 图像
        const svgBlob = new Blob([alipayLogoSvg], { type: "image/svg+xml" });
        const svgUrl = URL.createObjectURL(svgBlob);

        const logoImage = new Image();
        logoImage.crossOrigin = "anonymous";

        logoImage.onload = () => {
          // 绘制支付宝图标
          const logoX = centerX - iconSize / 2;
          const logoY = centerY - iconSize / 2;

          ctx.drawImage(logoImage, logoX, logoY, iconSize, iconSize);

          // 清理 URL 对象
          URL.revokeObjectURL(svgUrl);

          // 更新二维码显示
          const finalDataUrl = canvas.toDataURL("image/png");
          setQrCodeDataUrl(finalDataUrl);
        };

        logoImage.onerror = () => {
          // 如果 SVG 加载失败，使用备用方案
          console.warn("SVG logo failed to load, using fallback");

          // 绘制支付宝蓝色圆角矩形背景
          const rectSize = iconSize * 0.8;
          const cornerRadius = rectSize / 8;
          const rectX = centerX - rectSize / 2;
          const rectY = centerY - rectSize / 2;

          ctx.fillStyle = "#00A0EA"; // 支付宝蓝
          ctx.beginPath();
          ctx.roundRect(rectX, rectY, rectSize, rectSize, cornerRadius);
          ctx.fill();

          // 绘制白色"支"字
          ctx.fillStyle = "#FFFFFF";
          ctx.font = `bold ${
            rectSize * 0.6
          }px Arial, "Microsoft YaHei", sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("支", centerX, centerY);

          // 清理 URL 对象
          URL.revokeObjectURL(svgUrl);

          // 更新二维码显示
          const finalDataUrl = canvas.toDataURL("image/png");
          setQrCodeDataUrl(finalDataUrl);
        };

        logoImage.src = svgUrl;
      };

      qrImage.src = qrDataUrl;
    } catch (error) {
      console.error("生成二维码失败:", error);
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
        });
        setQrCodeDataUrl(basicQrDataUrl);
      } catch (basicError) {
        console.error("生成基础二维码也失败:", basicError);
      }
    }
  };

  const handleDecode = async () => {
    if (!inputUrl.trim()) {
      return;
    }

    setIsLoading(true);
    const result = extractAlipayScheme(inputUrl.trim());
    setDecodeResult(result);

    if (
      result.success &&
      result.paymentCode &&
      result.paymentCode !== "未找到收款码"
    ) {
      await generateQRCode(result.paymentCode);
    } else {
      setQrCodeDataUrl("");
    }

    setIsLoading(false);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error("复制失败:", error);
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeDataUrl) return;

    const link = document.createElement("a");
    link.download = "alipay-qr-code.png";
    link.href = qrCodeDataUrl;
    link.click();
  };

  const handleNFCRead = async (nfcData: string) => {
    console.log("NFC数据读取:", nfcData);

    // 将NFC读取的数据设置到输入框
    setInputUrl(nfcData);

    // 自动开始解码
    setIsLoading(true);
    const result = extractAlipayScheme(nfcData.trim());
    setDecodeResult(result);

    if (
      result.success &&
      result.paymentCode &&
      result.paymentCode !== "未找到收款码"
    ) {
      await generateQRCode(result.paymentCode);
    } else {
      setQrCodeDataUrl("");
    }

    setIsLoading(false);
  };

  return (
    <>
      <StructuredData />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center py-8">
            <div className="flex justify-center items-center gap-4 mb-4">
              <h1 className="text-4xl font-bold text-gray-900">
                支付宝 NFC 链接解码器
              </h1>
              <a
                href="https://github.com/14790897/Ali-NFC2QR"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Github className="w-5 h-5" />
                <span className="hidden sm:inline">GitHub</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <p className="text-gray-600">解码支付宝 NFC 链接并生成二维码</p>
          </div>

          {/* NFC Reader Section */}
          <NFCReaderComponent onNFCRead={handleNFCRead} />

          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="w-5 h-5" />
                输入 NFC 链接
              </CardTitle>
              <CardDescription>
                请输入完整的支付宝 NFC 链接进行解码
              </CardDescription>
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
              <Button
                onClick={handleDecode}
                disabled={!inputUrl.trim() || isLoading}
                className="w-full"
              >
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
                          <Input
                            value={decodeResult.originalLink}
                            readOnly
                            className="text-sm"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              copyToClipboard(decodeResult.originalLink)
                            }
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>收款码</Label>
                        <div className="flex gap-2">
                          <Input
                            value={decodeResult.paymentCode}
                            readOnly
                            className="text-sm"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              copyToClipboard(decodeResult.paymentCode)
                            }
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {decodeResult.error || "解码失败"}
                      </AlertDescription>
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
                          <img
                            src={qrCodeDataUrl || "/placeholder.svg"}
                            alt="支付宝收款二维码"
                            className="w-64 h-64"
                          />
                        </div>
                      </div>
                      <Button
                        onClick={downloadQRCode}
                        variant="outline"
                        className="w-full bg-transparent"
                      >
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
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-gray-600">
                <h4 className="font-semibold text-gray-900">
                  方法一：NFC 读取与写入（推荐）
                </h4>
                <p>1. 在支持的设备上点击"开始扫描 NFC"</p>
                <p>2. 将手机靠近支付宝 NFC 标签（2-4厘米距离）</p>
                <p>3. 系统将自动读取并解码 NFC 数据</p>
                <p>4. 自动生成对应的二维码</p>
                <p>
                  5. <strong>可选：</strong>
                  点击"写入到新标签"将数据复制到其他NFC标签
                </p>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <h4 className="font-semibold text-gray-900">
                  方法二：手动输入
                </h4>
                <p>1. 将完整的支付宝 NFC 链接粘贴到输入框中</p>
                <p>2. 点击"开始解码"按钮进行解析</p>
                <p>3. 系统将自动提取原始链接和收款码</p>
                <p>4. 如果解码成功，将自动生成对应的二维码</p>
                <p>5. 可以复制链接或下载二维码图片</p>
              </div>
            </CardContent>
          </Card>

          {/* Project Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Github className="w-5 h-5" />
                项目信息
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">开源项目</h4>
                  <p className="text-gray-600 mb-2">
                    Ali-NFC2QR 是一个开源项目，欢迎贡献代码和提出建议。
                  </p>
                  <a
                    href="https://github.com/14790897/Ali-NFC2QR"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
                  >
                    查看源码 <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">技术栈</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                      Next.js
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                      React
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                      TypeScript
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                      Tailwind CSS
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                      QRCode.js
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
