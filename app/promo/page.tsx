"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Smartphone,
  Zap,
  Shield,
  Github,
  Download,
  QrCode,
  Nfc,
  Star,
  Users,
  ArrowRight,
  CheckCircle,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { APP_VERSION, APP_NAME } from "@/lib/version";

export default function PromoPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <Nfc className="w-8 h-8 text-blue-500" />,
      title: "NFC 读取",
      description: "一键读取支付宝 NFC 标签，自动解码收款链接",
      highlight: "核心功能",
    },
    {
      icon: <QrCode className="w-8 h-8 text-green-500" />,
      title: "二维码生成",
      description: "生成精美的支付宝二维码，支持下载保存",
      highlight: "实用工具",
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-500" />,
      title: "NFC 写入",
      description: "复制 NFC 标签内容到新标签，轻松备份",
      highlight: "高级功能",
    },
    {
      icon: <Shield className="w-8 h-8 text-purple-500" />,
      title: "隐私安全",
      description: "本地处理，不上传任何数据，保护隐私",
      highlight: "安全保障",
    },
  ];

  const stats = [
    { number: "500+", label: "用户使用", icon: <Users className="w-5 h-5" /> },
    { number: "100%", label: "开源免费", icon: <Github className="w-5 h-5" /> },
    { number: "0", label: "数据收集", icon: <Shield className="w-5 h-5" /> },
  ];

  const steps = [
    {
      step: "01",
      title: "开启 NFC",
      description: "确保 Android 设备已开启 NFC 功能",
    },
    {
      step: "02", 
      title: "扫描标签",
      description: "将手机靠近支付宝 NFC 标签进行读取",
    },
    {
      step: "03",
      title: "获取结果",
      description: "自动解码并生成二维码，支持复制和下载",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div
            className={`text-center transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <Badge variant="secondary" className="mb-4 px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              {APP_NAME} v{APP_VERSION} 现已发布
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              支付宝 NFC 标签
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                解码神器
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              一键读取支付宝 NFC 收款标签，自动解码生成二维码。 支持 NFC
              写入、标签复制，完全免费开源。
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
                onClick={() => (window.location.href = "/")}
              >
                <Smartphone className="w-5 h-5 mr-2" />
                立即使用
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="px-8 py-3"
                onClick={() =>
                  window.open(
                    "https://github.com/14790897/Ali-NFC2QR",
                    "_blank"
                  )
                }
              >
                <Github className="w-5 h-5 mr-2" />
                查看源码
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-2 text-blue-600">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.number}
                </div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              强大功能，简单易用
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              专为支付宝 NFC 标签设计，提供完整的读取、解码、生成和写入解决方案
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <CardContent className="p-6">
                  <Badge
                    variant="secondary"
                    className="absolute top-4 right-4 text-xs"
                  >
                    {feature.highlight}
                  </Badge>

                  <div className="mb-4">{feature.icon}</div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              三步轻松搞定
            </h2>
            <p className="text-xl text-gray-600">
              简单三步，即可完成 NFC 标签读取和二维码生成
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.step}
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>

                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              用户好评如潮
            </h2>
            <p className="text-xl text-gray-600">来自真实用户的使用反馈</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "太方便了！以前需要找商家要二维码，现在直接扫一下 NFC
                标签就能生成，省时省力。"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  张
                </div>
                <div className="ml-3">
                  <div className="font-semibold">张先生</div>
                  <div className="text-sm text-gray-500">小店老板</div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "开源项目就是好，代码透明，功能实用，还不收集用户数据，值得信赖。"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                  李
                </div>
                <div className="ml-3">
                  <div className="font-semibold">李工程师</div>
                  <div className="text-sm text-gray-500">软件开发者</div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "NFC
                写入功能很棒，可以把收款码复制到多个标签，再也不怕标签丢失了。"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                  王
                </div>
                <div className="ml-3">
                  <div className="font-semibold">王女士</div>
                  <div className="text-sm text-gray-500">餐厅经理</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            准备好开始了吗？
          </h2>

          <p className="text-xl text-blue-100 mb-8">
            立即体验 Ali-NFC2QR，解锁支付宝 NFC 标签的无限可能
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="px-8 py-3"
              onClick={() => (window.location.href = "/")}
            >
              <Smartphone className="w-5 h-5 mr-2" />
              开始使用
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="px-8 py-3 text-white border-white hover:bg-white hover:text-blue-600"
              onClick={() =>
                window.open("https://github.com/14790897/Ali-NFC2QR", "_blank")
              }
            >
              <Github className="w-5 h-5 mr-2" />
              查看源码
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">{APP_NAME}</h3>
            <p className="text-gray-400 mb-6">开源的支付宝 NFC 链接解码器</p>

            <div className="flex justify-center items-center space-x-6 text-sm text-gray-400">
              <span>© 2024 Ali-NFC2QR</span>
              <span>•</span>
              <span>MIT License</span>
              <span>•</span>
              <a
                href="https://github.com/14790897/Ali-NFC2QR"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
