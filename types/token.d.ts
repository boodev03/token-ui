export interface Token {
    id: string;
    logo?: string;
    name: string;
    symbol: string;
    totalSupply?: number;
    priceUsd?: number;
    description?: string;
    website?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTokenDto {
    logo?: string;
    name: string;
    symbol: string;
    totalSupply?: number;
    priceUsd?: number;
    description?: string;
    website?: string;
}

export interface UpdateTokenDto extends Partial<CreateTokenDto> {
}

export interface TokenQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    symbol?: string;
    sort_by?: 'name' | 'symbol' | 'priceUsd' | 'createdAt';
    sort_order?: 'asc' | 'desc';
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
    meta?: {
        total: number;
        page: number;
        limit: number;
        total_pages: number;
    };
}

export interface TokenStats {
    total_tokens: number;
    total_market_cap: number;
    average_price: number;
}