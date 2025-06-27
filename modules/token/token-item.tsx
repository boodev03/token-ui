"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Token } from "@/types/token";
import { ExternalLink, TrendingDown, TrendingUp } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";

interface TokenItemProps {
  token: Token;
  showPriceChange: boolean;
  formatPrice: (price?: number) => string;
  formatSupply: (supply?: number) => string;
  onTokenClick: (tokenId: string) => void;
}

export default function TokenItem({
  token,
  showPriceChange,
  formatPrice,
  formatSupply,
  onTokenClick,
}: TokenItemProps) {
  // Mock price change for demo (in real app, this would come from API)
  const priceChange = useMemo(() => {
    if (!showPriceChange) return null;
    return (Math.random() - 0.5) * 20; // Random between -10% to +10%
  }, [showPriceChange]);

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-gray-300 shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {/* Token Logo */}
            <div className="w-12 h-12 relative rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
              {token.logo ? (
                <Image
                  src={token.logo}
                  alt={`${token.name} logo`}
                  className="object-cover"
                  fill
                />
              ) : (
                <span className="text-white font-bold text-lg">
                  {token.symbol.charAt(0)}
                </span>
              )}
            </div>

            <div>
              <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                {token.name}
              </h3>
              <Badge variant="secondary" className="text-xs">
                {token.symbol}
              </Badge>
            </div>
          </div>

          {/* External Link */}
          {token.website && (
            <a
              href={token.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-600 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>

        {/* Price and Stats */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Price</span>
            <div className="text-right">
              <div className="font-semibold text-lg">
                {formatPrice(token.priceUsd)}
              </div>
              {priceChange !== null && (
                <div
                  className={`flex items-center text-xs ${
                    priceChange >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {priceChange >= 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(priceChange).toFixed(2)}%
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Supply</span>
            <span className="font-medium">
              {formatSupply(token.totalSupply)}
            </span>
          </div>
        </div>

        {/* Description */}
        {token.description && (
          <p className="text-sm text-gray-600 mt-4 line-clamp-2">
            {token.description}
          </p>
        )}

        {/* View Details Button */}
        <div className="mt-6">
          <Button
            variant="outline"
            className="w-full group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors"
            onClick={() => onTokenClick(token.id)}
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
