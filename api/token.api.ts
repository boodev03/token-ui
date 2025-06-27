import axiosInstance from '@/config/axios';
import {
    Token,
    CreateTokenDto,
    UpdateTokenDto,
    TokenQueryParams,
    ApiResponse,
    TokenStats
} from '../types/token';

export const tokenApi = {
    // Get all tokens with filtering and pagination
    getTokens: async (params?: TokenQueryParams): Promise<ApiResponse<Token[]>> => {
        const response = await axiosInstance.get('/api/tokens', { params });
        return response.data;
    },

    // Get token by ID
    getTokenById: async (id: string): Promise<ApiResponse<Token>> => {
        const response = await axiosInstance.get(`/api/tokens/${id}`);
        return response.data;
    },

    // Get token by symbol
    getTokenBySymbol: async (symbol: string): Promise<ApiResponse<Token>> => {
        const response = await axiosInstance.get(`/api/tokens/symbol/${symbol}`);
        return response.data;
    },

    // Create new token
    createToken: async (data: CreateTokenDto): Promise<ApiResponse<Token>> => {
        const response = await axiosInstance.post('/api/tokens', data);
        return response.data;
    },

    // Update token
    updateToken: async (id: string, data: UpdateTokenDto): Promise<ApiResponse<Token>> => {
        const response = await axiosInstance.put(`/api/tokens/${id}`, data);
        return response.data;
    },

    // Delete token
    deleteToken: async (id: string): Promise<ApiResponse<null>> => {
        const response = await axiosInstance.delete(`/api/tokens/${id}`);
        return response.data;
    },

    // Get token statistics
    getTokenStats: async (): Promise<ApiResponse<TokenStats>> => {
        const response = await axiosInstance.get('/api/tokens/stats');
        return response.data;
    },
};