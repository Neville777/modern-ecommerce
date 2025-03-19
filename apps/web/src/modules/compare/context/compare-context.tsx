'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@apps/shared/types';
import { getProduct } from '@/modules/products/actions/get-product';

interface CompareContextType {
  items: string[];
  products: Product[];
  addItem: (productId: string) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCompare: () => Promise<void>;
  isInCompare: (productId: string) => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const COMPARE_STORAGE_KEY = 'compare_items';
const MAX_COMPARE_ITEMS = 4; // Maximum number of items that can be compared

export function CompareProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const { toast } = useToast();

  // Load initial compare data
  useEffect(() => {
    const loadCompare = async () => {
      try {
        // Load compare from localStorage
        const storedCompare = localStorage.getItem(COMPARE_STORAGE_KEY);
        if (storedCompare) {
          const productIds = JSON.parse(storedCompare) as string[];
          setItems(productIds);

          // Fetch product details for the items in compare
          const productDetails = await Promise.all(
            productIds.map(async id => {
              try {
                return await getProduct(id);
              } catch (error) {
                console.error(`Failed to fetch product ${id}:`, error);
                return null;
              }
            }),
          );

          setProducts(productDetails.filter(Boolean) as Product[]);
        }
      } catch (error) {
        console.error('Error loading compare data:', error);
      }
    };

    loadCompare();
  }, []);

  // Sync compare list to localStorage
  useEffect(() => {
    localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = async (productId: string) => {
    try {
      if (items.includes(productId)) {
        return; // Item already in compare
      }

      if (items.length >= MAX_COMPARE_ITEMS) {
        toast({
          title: 'Compare list full',
          description: `You can only compare up to ${MAX_COMPARE_ITEMS} products. Please remove an item first.`,
          variant: 'destructive',
        });
        return;
      }

      // Fetch product details
      const product = await getProduct(productId);
      if (!product) {
        throw new Error('Failed to fetch product details');
      }

      setItems([...items, productId]);
      setProducts([...products, product]);

      toast({
        title: 'Added to compare',
        description: 'Product has been added to your comparison list.',
      });
    } catch (error) {
      toast({
        title: 'Error adding item',
        description:
          'There was a problem adding this product to your comparison list.',
        variant: 'destructive',
      });
    }
  };

  const removeItem = async (productId: string) => {
    try {
      setItems(items.filter(id => id !== productId));
      setProducts(products.filter(product => product._id !== productId));

      toast({
        title: 'Removed from compare',
        description: 'Product has been removed from your comparison list.',
      });
    } catch (error) {
      toast({
        title: 'Error removing item',
        description:
          'There was a problem removing this product from your comparison list.',
        variant: 'destructive',
      });
    }
  };

  const clearCompare = async () => {
    try {
      setItems([]);
      setProducts([]);

      toast({
        title: 'Compare list cleared',
        description:
          'All products have been removed from your comparison list.',
      });
    } catch (error) {
      toast({
        title: 'Error clearing compare list',
        description: 'There was a problem clearing your comparison list.',
        variant: 'destructive',
      });
    }
  };

  const isInCompare = (productId: string) => {
    return items.includes(productId);
  };

  return (
    <CompareContext.Provider
      value={{
        items,
        products,
        addItem,
        removeItem,
        clearCompare,
        isInCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};
