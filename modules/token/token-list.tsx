"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";
import { useTokens } from "@/hooks/use-token";
import { Loader2, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import TokenDetailModal from "./token-detail-modal";
import TokenItem from "./token-item";
import TokenItemLoading from "./token-item-loading";

interface TokenListProps {
  searchable?: boolean;
  limit?: number;
  showPriceChange?: boolean;
}

export default function TokenList({
  searchable = true,
  limit,
  showPriceChange = true,
}: TokenListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "priceUsd" | "createdAt">(
    "createdAt"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    data: tokensData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useTokens({
    search: debouncedSearchQuery || undefined,
    sort_by: sortBy,
    sort_order: sortOrder,
    limit: limit || 12,
  });

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
      rootMargin: "100px", // Start loading 100px before the element is visible
    });

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [handleObserver]);

  const handleTokenClick = (tokenId: string) => {
    setSelectedTokenId(tokenId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTokenId(null);
  };

  const tokens = useMemo(() => {
    if (!tokensData?.pages) return [];
    return tokensData.pages.flatMap((page) => page.data || []);
  }, [tokensData]);

  const formatPrice = (price?: number) => {
    if (!price) return "N/A";
    if (price < 0.01) return `$${price.toFixed(8)}`;
    if (price < 1) return `$${price.toFixed(6)}`;
    return `$${price.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatSupply = (supply?: number) => {
    if (!supply) return "N/A";
    if (supply >= 1e12) return `${(supply / 1e12).toFixed(1)}T`;
    if (supply >= 1e9) return `${(supply / 1e9).toFixed(1)}B`;
    if (supply >= 1e6) return `${(supply / 1e6).toFixed(1)}M`;
    if (supply >= 1e3) return `${(supply / 1e3).toFixed(1)}K`;
    return supply.toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {searchable && (
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search tokens by name or symbol..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                disabled
              />
            </div>

            <div className="flex gap-2">
              <Select disabled>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Latest" />
                </SelectTrigger>
              </Select>

              <Button variant="outline" size="sm" className="h-9" disabled>
                ↓
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: limit || 12 }).map((_, index) => (
            <TokenItemLoading key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Failed to load tokens. Please try again.</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {searchable && (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search tokens by name or symbol..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Select
              value={sortBy}
              onValueChange={(value) =>
                setSortBy(value as "name" | "priceUsd" | "createdAt")
              }
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Latest</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="priceUsd">Price</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="h-9"
            >
              {sortOrder === "asc" ? "↑" : "↓"}
            </Button>
          </div>
        </div>
      )}

      {tokens.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No tokens found.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tokens.map((token) => (
              <TokenItem
                key={token.id}
                token={token}
                showPriceChange={showPriceChange}
                formatPrice={formatPrice}
                formatSupply={formatSupply}
                onTokenClick={handleTokenClick}
              />
            ))}
          </div>

          {hasNextPage && (
            <div
              ref={loadMoreRef}
              className="flex items-center justify-center py-8"
            >
              {isFetchingNextPage && (
                <div className="flex items-center text-gray-500">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  <span>Loading more tokens...</span>
                </div>
              )}
            </div>
          )}

          {!hasNextPage && tokens.length > 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">
                🎉 You've reached the end! No more tokens to load.
              </p>
            </div>
          )}
        </>
      )}

      <TokenDetailModal
        tokenId={selectedTokenId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
