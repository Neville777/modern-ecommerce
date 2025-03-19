'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/modules/auth/hooks/use-user';
import { apiClient } from '@/lib/api-client';
import { Product } from '@apps/shared/types';

interface WishlistContextType {
  items: string[];
  addItem: (productId: string) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined,
);

const WISHLIST_STORAGE_KEY = 'wishlist_items';

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<string[]>([]);
  const { user } = useUser();
  const { toast } = useToast();

  // Load initial wishlist data
  useEffect(() => {
    const loadWishlist = async () => {
      try {
        if (user) {
          // For authenticated users, we would fetch from API
          // This is a placeholder for actual API integration
          // const { data } = await apiClient.get('/wishlist');
          // setItems(data.items);

          // For now, we'll use localStorage even for logged in users
          const storedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
          if (storedWishlist) {
            setItems(JSON.parse(storedWishlist));
          }
        } else {
          // Load wishlist from localStorage for guests
          const storedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
          if (storedWishlist) {
            setItems(JSON.parse(storedWishlist));
          }
        }
      } catch (error) {
        console.error('Error loading wishlist:', error);
      }
    };

    loadWishlist();
  }, [user]);

  // Sync wishlist to localStorage
  useEffect(() => {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = async (productId: string) => {
    try {
      if (items.includes(productId)) {
        return; // Item already in wishlist
      }

      setItems([...items, productId]);

      // API call would go here for authenticated users
      // if (user) {
      //   await apiClient.post('/wishlist/items', { productId });
      // }

      toast({
        title: 'Added to wishlist',
        description: 'Item has been added to your wishlist.',
      });
    } catch (error) {
      toast({
        title: 'Error adding item',
        description: 'There was a problem adding this item to your wishlist.',
        variant: 'destructive',
      });
    }
  };

  const removeItem = async (productId: string) => {
    try {
      setItems(items.filter(id => id !== productId));

      // API call would go here for authenticated users
      // if (user) {
      //   await apiClient.delete(`/wishlist/items/${productId}`);
      // }

      toast({
        title: 'Removed from wishlist',
        description: 'Item has been removed from your wishlist.',
      });
    } catch (error) {
      toast({
        title: 'Error removing item',
        description:
          'There was a problem removing this item from your wishlist.',
        variant: 'destructive',
      });
    }
  };

  const clearWishlist = async () => {
    try {
      setItems([]);

      // API call would go here for authenticated users
      // if (user) {
      //   await apiClient.delete('/wishlist');
      // }

      toast({
        title: 'Wishlist cleared',
        description: 'All items have been removed from your wishlist.',
      });
    } catch (error) {
      toast({
        title: 'Error clearing wishlist',
        description: 'There was a problem clearing your wishlist.',
        variant: 'destructive',
      });
    }
  };

  const isInWishlist = (productId: string) => {
    return items.includes(productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
