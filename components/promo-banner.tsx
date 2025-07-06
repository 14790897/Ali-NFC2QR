"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Github,
  QrCode,
  Nfc,
  Star,
  ArrowRight,
  Sparkles,
  X,
} from "lucide-react";
import { APP_VERSION, APP_NAME } from "@/lib/version";

interface PromoBannerProps {
  onClose?: () => void;
  showCloseButton?: boolean;
}

export default function PromoBanner({
  onClose,
  showCloseButton = false,
}: PromoBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  return (
    <Card className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
      {showCloseButton && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-1 right-1 z-10 h-6 w-6 p-0"
          onClick={handleClose}
        >
          <X className="w-3 h-3" />
        </Button>
      )}

      <CardContent className="p-4">
        {/* 紧凑的头部 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="px-2 py-1 text-xs">
              <Sparkles className="w-3 h-3 mr-1" />
              {APP_NAME} v{APP_VERSION}
            </Badge>
            <span className="text-sm font-semibold text-gray-900 hidden sm:inline">
              支付宝 NFC 标签解码神器
            </span>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-7 px-3 text-xs"
              onClick={() => (window.location.href = "/promo")}
            >
              查看详情
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="h-7 px-3 text-xs"
              onClick={() =>
                window.open("https://github.com/14790897/Ali-NFC2QR", "_blank")
              }
            >
              <Github className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">GitHub</span>
              <span className="sm:hidden">源码</span>
            </Button>
          </div>
        </div>

        {/* 简化的功能展示 - 移动端隐藏部分内容 */}
        <div className="flex items-center justify-between text-xs text-gray-600 mt-2 pt-2 border-t border-gray-200">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-1">
              <Nfc className="w-3 h-3 text-blue-500" />
              <span>NFC</span>
            </div>
            <div className="flex items-center gap-1">
              <QrCode className="w-3 h-3 text-green-500" />
              <span>二维码</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-purple-500" />
              <span>安全</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">

            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>免费</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
