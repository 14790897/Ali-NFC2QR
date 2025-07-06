"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Smartphone,
  Zap,
  Shield,
  Github,
  QrCode,
  Nfc,
  Star,
  ArrowRight,
  ExternalLink,
  Sparkles,
  X,
} from "lucide-react";
import { APP_VERSION, APP_NAME } from "@/lib/version";

interface PromoBannerProps {
  onClose?: () => void;
  showCloseButton?: boolean;
}

export default function PromoBanner({ onClose, showCloseButton = false }: PromoBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  const features = [
    {
      icon: <Nfc className="w-6 h-6 text-blue-500" />,
      title: "NFC 读取",
      description: "一键读取支付宝标签",
    },
    {
      icon: <QrCode className="w-6 h-6 text-green-500" />,
      title: "二维码生成",
      description: "生成精美二维码",
    },
    {
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      title: "NFC 写入",
      description: "复制标签到新设备",
    },
    {
      icon: <Shield className="w-6 h-6 text-purple-500" />,
      title: "隐私安全",
      description: "本地处理，保护隐私",
    },
  ];

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 border-2 border-blue-200">
      {showCloseButton && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 z-10"
          onClick={handleClose}
        >
          <X className="w-4 h-4" />
        </Button>
      )}
      
      <CardContent className="p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <Badge variant="secondary" className="mb-3 px-3 py-1">
            <Sparkles className="w-4 h-4 mr-1" />
            {APP_NAME} v{APP_VERSION}
          </Badge>
          
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            支付宝 NFC 标签
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              解码神器
            </span>
          </h2>
          
          <p className="text-gray-600 mb-4">
            一键读取支付宝 NFC 收款标签，自动解码生成二维码
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-3 rounded-lg bg-white/50 hover:bg-white/80 transition-colors">
              <div className="flex justify-center mb-2">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-sm text-gray-900 mb-1">
                {feature.title}
              </h3>
              <p className="text-xs text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6 p-4 bg-white/50 rounded-lg">
          <div className="text-center">
            <div className="flex justify-center mb-1 text-blue-600">
              <Star className="w-4 h-4" />
            </div>
            <div className="text-lg font-bold text-gray-900">1.2k+</div>
            <div className="text-xs text-gray-600">GitHub Stars</div>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-1 text-green-600">
              <Smartphone className="w-4 h-4" />
            </div>
            <div className="text-lg font-bold text-gray-900">500+</div>
            <div className="text-xs text-gray-600">用户使用</div>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-1 text-purple-600">
              <Github className="w-4 h-4" />
            </div>
            <div className="text-lg font-bold text-gray-900">100%</div>
            <div className="text-xs text-gray-600">开源免费</div>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-1 text-red-600">
              <Shield className="w-4 h-4" />
            </div>
            <div className="text-lg font-bold text-gray-900">0</div>
            <div className="text-xs text-gray-600">数据收集</div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            onClick={() => window.location.href = '/promo'}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            查看详情
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => window.open('https://github.com/14790897/Ali-NFC2QR', '_blank')}
          >
            <Github className="w-4 h-4 mr-2" />
            GitHub
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Features List */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              支持 Chrome for Android 89+
            </div>
            <div className="flex items-center text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              完全免费开源
            </div>
            <div className="flex items-center text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              本地处理，保护隐私
            </div>
            <div className="flex items-center text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              支持 NFC 读取和写入
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
