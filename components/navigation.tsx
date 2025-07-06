"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  Sparkles,
  Github,
  ExternalLink,
} from "lucide-react";
import { APP_VERSION, APP_NAME } from "@/lib/version";

export default function Navigation() {
  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="font-bold text-gray-900">{APP_NAME}</span>
              <Badge variant="secondary" className="text-xs">
                v{APP_VERSION}
              </Badge>
            </a>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              主页
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.href = '/promo'}
              className="flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              产品介绍
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('https://github.com/14790897/Ali-NFC2QR', '_blank')}
              className="flex items-center gap-2"
            >
              <Github className="w-4 h-4" />
              GitHub
              <ExternalLink className="w-3 h-3" />
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('https://github.com/14790897/Ali-NFC2QR', '_blank')}
            >
              <Github className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
