import {
    keepPreviousData,
    useInfiniteQuery,
    useMutation,
    UseMutationOptions,
    useQuery,
    useQueryClient,
    UseQueryOptions
} from '@tanstack/react-query';

import { tokenApi } from '@/api/token.api';
import {
    ApiResponse,
    CreateTokenDto,
    Token,
    TokenQueryParams,
    UpdateTokenDto
} from '../types/token';

// Error type for better type safety
interface ApiError {
    response?: {
        data?: {
            error?: string;
            message?: string;
        };
    };
    message?: string;
}

// Query Keys
export const tokenKeys = {
    all: ['tokens'] as const,
    lists: () => [...tokenKeys.all, 'list'] as const,
    list: (params?: TokenQueryParams) => [...tokenKeys.lists(), params] as const,
    details: () => [...tokenKeys.all, 'detail'] as const,
    detail: (id: string) => [...tokenKeys.details(), id] as const,
};

// Hook to get all tokens with infinite scroll
export const useTokens = (
    params?: Omit<TokenQueryParams, 'page'>,
) => {
    return useInfiniteQuery({
        queryKey: tokenKeys.list(params),
        queryFn: ({ pageParam = 1 }) =>
            tokenApi.getTokens({ ...params, page: pageParam as number }),
        getNextPageParam: (lastPage) => {
            if (lastPage.meta && lastPage.meta.page < lastPage.meta.total_pages) {
                return lastPage.meta.page + 1;
            }
            return undefined;
        },
        initialPageParam: 1,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

// Hook to get token by ID
export const useToken = (
    id: string,
    options?: UseQueryOptions<ApiResponse<Token>, ApiError>
) => {
    return useQuery({
        queryKey: tokenKeys.detail(id),
        queryFn: () => tokenApi.getTokenById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // 5 minutes
        ...options,
    });
};

// Hook to create token
export const useCreateToken = (
    options?: UseMutationOptions<ApiResponse<Token>, ApiError, CreateTokenDto>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateTokenDto) => tokenApi.createToken(data),
        onSuccess: (response) => {
            // Invalidate and refetch tokens list
            queryClient.invalidateQueries({ queryKey: tokenKeys.lists() });

            // Add the new token to cache
            if (response.data) {
                queryClient.setQueryData(
                    tokenKeys.detail(response.data.id),
                    response
                );
            }
        },
        onError: (error: ApiError) => {
            console.error('Failed to create token:', error);
        },
        ...options,
    });
};

// Hook to update token
export const useUpdateToken = (
    options?: UseMutationOptions<ApiResponse<Token>, ApiError, { id: string; data: UpdateTokenDto }>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateTokenDto }) =>
            tokenApi.updateToken(id, data),
        onSuccess: (response, { id }) => {
            // Update the token in cache
            if (response.data) {
                queryClient.setQueryData(
                    tokenKeys.detail(id),
                    response
                );
            }

            // Invalidate related queries
            queryClient.invalidateQueries({ queryKey: tokenKeys.lists() });
        },
        onError: (error: ApiError) => {
            console.error('Failed to update token:', error);
        },
        ...options,
    });
};

// Hook to delete token
export const useDeleteToken = (
    options?: UseMutationOptions<ApiResponse<null>, ApiError, string>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => tokenApi.deleteToken(id),
        onSuccess: (response, id) => {
            // Remove token from cache
            queryClient.removeQueries({ queryKey: tokenKeys.detail(id) });

            // Invalidate related queries
            queryClient.invalidateQueries({ queryKey: tokenKeys.lists() });
        },
        onError: (error: ApiError) => {
            console.error('Failed to delete token:', error);
        },
        ...options,
    });
};

// Utility function to extract error message
export const getErrorMessage = (error: ApiError): string => {
    return error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        'An unknown error occurred';
};

// Hook for paginated tokens with 10 items per page
export const usePaginatedTokens = (
    params?: Omit<TokenQueryParams, 'limit'>,
    options?: UseQueryOptions<ApiResponse<Token[]>, ApiError>
) => {
    const queryParams = {
        ...params,
        limit: 10, // Fixed at 10 items per page
    };

    return useQuery({
        queryKey: tokenKeys.list(queryParams),
        queryFn: () => tokenApi.getTokens(queryParams),
        staleTime: 5 * 60 * 1000, // 5 minutes
        placeholderData: keepPreviousData,
        ...options,
    });
};
