"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function TokenItemLoading() {
  return (
    <Card className="border-gray-300 shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {/* Token Logo Skeleton */}
            <Skeleton className="w-12 h-12 rounded-full" />

            <div>
              {/* Token Name Skeleton */}
              <Skeleton className="h-6 w-24 mb-2" />
              {/* Token Symbol Badge Skeleton */}
              <Skeleton className="h-5 w-12 rounded-full" />
            </div>
          </div>

          {/* External Link Skeleton */}
          <Skeleton className="h-4 w-4" />
        </div>

        {/* Price and Stats */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-8" />
            <div className="text-right">
              <Skeleton className="h-6 w-16 mb-1" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-10" />
            <Skeleton className="h-5 w-14" />
          </div>
        </div>

        {/* Description Skeleton */}
        <div className="mt-4 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        {/* View Details Button Skeleton */}
        <div className="mt-6">
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}
