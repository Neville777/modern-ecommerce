'use server';

import { fetchApi } from '@/lib/fetch-api';
import type { Product } from '@apps/shared/types';

export async function getProduct(id: string): Promise<Product | null> {
  try {
    // Early validation to avoid fetching with undefined ID
    if (!id) {
      console.error('Product ID is undefined or empty');
      return null;
    }

    // Log what we're fetching
    console.log(`Fetching product from: /products/${id}`);

    const response = await fetchApi(`/products/${id}`);

    if (!response.ok) {
      // Handle specific status codes
      if (response.status === 404) {
        console.error(`Product not found: ${id}`);
        return null;
      }

      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const product = (await response.json()) as Product;
    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}
