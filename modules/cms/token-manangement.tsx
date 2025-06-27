/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getErrorMessage, usePaginatedTokens } from "@/hooks/use-token";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import AddToken from "./add-token";
import TokenList from "./token-list";

export default function TokenManagement() {
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: tokensResponse,
    isLoading,
    error: tokensError,
  } = usePaginatedTokens({
    page: currentPage,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 h-screen flex items-center justify-center">
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading tokens...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (tokensError) {
    return (
      <div className="container mx-auto p-6 h-screen flex items-center justify-center">
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <p className="text-red-500">
              Error loading tokens: {getErrorMessage(tokensError as any)}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 h-screen flex flex-col">
      <Card className="flex-1 flex flex-col border-none">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Token Management</CardTitle>
              <CardDescription>
                Manage cryptocurrency tokens in your database
              </CardDescription>
            </div>
            <AddToken />
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          <TokenList
            tokens={tokensResponse?.data || []}
            isLoading={isLoading}
            currentPage={currentPage}
            totalPages={tokensResponse?.meta?.total_pages || 1}
            onPageChange={handlePageChange}
          />
        </CardContent>
      </Card>
    </div>
  );
}
