/* eslint-disable @next/next/no-img-element */
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToken } from "@/hooks/use-token";
import {
  ExternalLink,
  Loader2,
  Copy,
  TrendingUp,
  TrendingDown,
  Globe,
  Calendar,
  DollarSign,
  Hash,
  Info,
} from "lucide-react";
import { useState } from "react";

interface TokenDetailModalProps {
  tokenId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TokenDetailModal({
  tokenId,
  isOpen,
  onClose,
}: TokenDetailModalProps) {
  const [copied, setCopied] = useState(false);

  const { data: tokenResponse, isLoading, error } = useToken(tokenId || "");
  const token = tokenResponse?.data;

  // Mock price change for demo (in real app, this would come from API)
  const priceChange = token ? (Math.random() - 0.5) * 20 : 0;

  // Format price with proper decimal places
  const formatPrice = (price?: number) => {
    if (!price) return "N/A";
    if (price < 0.01) return `$${price.toFixed(8)}`;
    if (price < 1) return `$${price.toFixed(6)}`;
    return `$${price.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Format supply with proper abbreviations
  const formatSupply = (supply?: number) => {
    if (!supply) return "N/A";
    if (supply >= 1e12) return `${(supply / 1e12).toFixed(2)}T`;
    if (supply >= 1e9) return `${(supply / 1e9).toFixed(2)}B`;
    if (supply >= 1e6) return `${(supply / 1e6).toFixed(2)}M`;
    if (supply >= 1e3) return `${(supply / 1e3).toFixed(2)}K`;
    return supply.toLocaleString();
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Copy to clipboard function
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-[95vw] sm:w-[90vw] md:w-[85vw] lg:w-[80vw] xl:w-[75vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 flex-wrap">
            {token && (
              <>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
                  {token.logo ? (
                    <img
                      src={token.logo}
                      alt={`${token.name} logo`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-bold text-sm">
                      {token.symbol.charAt(0)}
                    </span>
                  )}
                </div>
                <span className="break-words">{token.name}</span>
                <Badge variant="secondary">{token.symbol}</Badge>
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            Detailed information about this token
          </DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading token details...</span>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-500">Failed to load token details.</p>
          </div>
        )}

        {token && (
          <div className="space-y-6">
            {/* Price Section */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Current Price</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">
                    {formatPrice(token.priceUsd)}
                  </p>
                </div>
                <div
                  className={`flex items-center px-3 py-2 rounded-full ${
                    priceChange >= 0
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {priceChange >= 0 ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  <span className="font-semibold">
                    {Math.abs(priceChange).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={<Hash className="h-4 w-4" />}
                label="Total Supply"
                value={formatSupply(token.totalSupply)}
              />
              <StatCard
                icon={<DollarSign className="h-4 w-4" />}
                label="Market Cap"
                value={
                  token.priceUsd && token.totalSupply
                    ? formatPrice(token.priceUsd * token.totalSupply)
                    : "N/A"
                }
              />
              <StatCard
                icon={<Calendar className="h-4 w-4" />}
                label="Created"
                value={formatDate(token.createdAt)}
              />
              <StatCard
                icon={<Info className="h-4 w-4" />}
                label="Updated"
                value={formatDate(token.updatedAt)}
              />
            </div>

            {/* Description */}
            {token.description && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center">
                  <Info className="h-4 w-4 mr-2" />
                  About {token.name}
                </h3>
                <p className="text-gray-700 leading-relaxed break-words">
                  {token.description}
                </p>
              </div>
            )}

            {/* External Links & Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
              {token.website && (
                <a
                  href={token.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button variant="outline" className="w-full">
                    <Globe className="h-4 w-4 mr-2" />
                    Visit Website
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </a>
              )}

              <Button
                variant="outline"
                onClick={() => copyToClipboard(token.id)}
                className="flex-1"
              >
                {copied ? (
                  "Copied!"
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Token ID
                  </>
                )}
              </Button>
            </div>

            {/* Token ID */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Token ID</p>
              <p className="font-mono text-xs break-all text-gray-800">
                {token.id}
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Stat Card Component for Modal
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <div className="bg-white border rounded-lg p-4 text-center">
      <div className="flex items-center justify-center mb-2">
        <div className="text-blue-600">{icon}</div>
      </div>
      <p className="text-xs text-gray-600 mb-1">{label}</p>
      <p className="font-semibold text-sm text-gray-900 break-words">{value}</p>
    </div>
  );
}
