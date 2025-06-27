/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ConfirmDialog from "@/components/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getErrorMessage, useDeleteToken } from "@/hooks/use-token";
import { Token } from "@/types/token";
import { ExternalLink, Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import EditToken from "./edit-token";

interface TokenListProps {
  tokens: Token[];
  isLoading: boolean;
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
}

export default function TokenList({
  tokens,
  isLoading,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  onPageChange,
}: TokenListProps) {
  const deleteTokenMutation = useDeleteToken();

  const handleDelete = async (tokenId: string) => {
    try {
      await deleteTokenMutation.mutateAsync(tokenId);
      toast.success("Token deleted successfully");
    } catch (error) {
      toast.error("Failed to delete token");
      console.error("Failed to delete token:", getErrorMessage(error as any));
    }
  };

  const formatNumber = (num?: number | string) => {
    if (!num) return "-";
    const numValue = typeof num === "string" ? parseFloat(num) : num;
    return new Intl.NumberFormat().format(numValue);
  };

  const formatPrice = (price?: number) => {
    if (!price) return "-";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    }).format(price);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show ellipsis logic for larger page counts
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, currentPage + 2);

      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) pages.push("...");
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 rounded-md border overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Logo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Symbol</TableHead>
              <TableHead>Total Supply</TableHead>
              <TableHead>Price (USD)</TableHead>
              <TableHead>Website</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span>Loading tokens...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : tokens.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  No tokens found. Add your first token to get started.
                </TableCell>
              </TableRow>
            ) : (
              tokens.map((token) => (
                <TableRow key={token.id}>
                  <TableCell>
                    {token.logo ? (
                      <Image
                        src={token.logo}
                        alt={token.name}
                        className="w-8 h-8 rounded-full"
                        width={32}
                        height={32}
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-xs font-medium">
                          {token.symbol.charAt(0)}
                        </span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{token.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{token.symbol}</Badge>
                  </TableCell>
                  <TableCell>{formatNumber(token.totalSupply)}</TableCell>
                  <TableCell>{formatPrice(token.priceUsd)}</TableCell>
                  <TableCell>
                    {token.website ? (
                      <a
                        href={token.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(token.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <EditToken token={token} disabled={isLoading} />
                      <ConfirmDialog
                        title="Delete Token"
                        description={`Are you sure you want to delete "${token.name}"? This action cannot be undone.`}
                        confirmText="Delete"
                        cancelText="Cancel"
                        variant="destructive"
                        onConfirm={() => handleDelete(token.id)}
                        loading={deleteTokenMutation.isPending}
                        disabled={isLoading}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={deleteTokenMutation.isPending || isLoading}
                        >
                          {deleteTokenMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </ConfirmDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t">
          <div className="text-sm text-gray-500 text-center sm:text-left order-2 sm:order-1">
            Page {currentPage} of {totalPages}{" "}
            {totalItems > 0 && `(${totalItems} total tokens)`}
          </div>

          <Pagination className="order-1 sm:order-2">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onPageChange && currentPage > 1) {
                      onPageChange(currentPage - 1);
                    }
                  }}
                  className={
                    currentPage <= 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              <div className="hidden sm:contents">
                {getPageNumbers().map((page, index) => (
                  <PaginationItem key={index}>
                    {page === "..." ? (
                      <span className="flex size-9 items-center justify-center">
                        ...
                      </span>
                    ) : (
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (onPageChange && typeof page === "number") {
                            onPageChange(page);
                          }
                        }}
                        isActive={page === currentPage}
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}
              </div>

              <div className="sm:hidden flex items-center px-2">
                <span className="text-sm text-gray-500">
                  {currentPage} / {totalPages}
                </span>
              </div>

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onPageChange && currentPage < totalPages) {
                      onPageChange(currentPage + 1);
                    }
                  }}
                  className={
                    currentPage >= totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
