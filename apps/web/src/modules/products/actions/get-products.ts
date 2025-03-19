// modules/products/actions/get-products.ts
'use server';

import { fetchApi } from '@/lib/fetch-api';
import type { PaginatedResponse, Product } from '@apps/shared/types';

export async function getProducts(
  page: number = 1,
  limit: number = 10,
  keyword?: string,
): Promise<PaginatedResponse<Product>> {
  try {
    const searchParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (keyword) {
      searchParams.append('keyword', keyword);
    }

    const response = await fetchApi(`/products?${searchParams.toString()}`);

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    const data = (await response.json()) as PaginatedResponse<Product>;

    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      items: [],
      total: 0,
      page: 1,
      pages: 1,
    };
  }
}
