"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Coins, DollarSign, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

interface TokenHeroProps {
  showStats?: boolean;
}

export default function TokenHero({ showStats = true }: TokenHeroProps) {
  // Mock stats (in real app, these would come from API)
  const stats = [
    {
      icon: <Coins className="h-6 w-6" />,
      label: "Total Tokens",
      value: "1,234",
      change: "+12%",
    },
    {
      icon: <DollarSign className="h-6 w-6" />,
      label: "Total Market Cap",
      value: "$2.5B",
      change: "+8.5%",
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      label: "24h Volume",
      value: "$125M",
      change: "+15.2%",
    },
    {
      icon: <Users className="h-6 w-6" />,
      label: "Active Traders",
      value: "45.6K",
      change: "+5.8%",
    },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Discover Tokens
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore the latest cryptocurrency tokens with real-time data,
            comprehensive analytics, and detailed information.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/tokens">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Explore All Tokens
            </Button>
          </Link>
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </div>
      </div>

      {/* Stats Section */}
      {showStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-md">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-4">
                  <div className="text-blue-600">{stat.icon}</div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
                <Badge
                  variant="secondary"
                  className="text-green-600 bg-green-100"
                >
                  {stat.change}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
