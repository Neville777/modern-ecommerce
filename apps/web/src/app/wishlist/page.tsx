'use client';

import { Container } from '@/components/ui/container';
import { useWishlist } from '@/modules/wishlist/context/wishlist-context';
import { Button } from '@/components/ui/button';
import { ArrowLeft, X, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/modules/cart/context/cart-context';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@apps/shared/types';
import { useEffect, useState } from 'react';
import { getProduct } from '@/modules/products/actions/get-product';
import { Card } from '@/components/ui/card';

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlist();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productData = await Promise.all(
          items.map(async id => {
            try {
              return await getProduct(id);
            } catch (error) {
              console.error(`Failed to fetch product ${id}:`, error);
              return null;
            }
          }),
        );

        setProducts(productData.filter(Boolean) as Product[]);
      } catch (error) {
        console.error('Error fetching wishlist products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [items]);

  const handleAddToCart = async (productId: string) => {
    try {
      await addItem(productId, 1);
      toast({
        title: 'Added to cart',
        description: 'Product has been added to your cart',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add item to cart',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <Container>
        <div className="py-10">
          <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>
          <div className="grid grid-cols-4 gap-6 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="h-80 animate-pulse">
                <div className="h-full flex flex-col">
                  <div className="flex-1 bg-gray-200"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    );
  }

  if (products.length === 0) {
    return (
      <Container>
        <div className="py-10 text-center">
          <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>
          <p className="text-muted-foreground mb-6">Your wishlist is empty.</p>
          <Button asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Wishlist</h1>
          <div className="space-x-4">
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Link>
            </Button>
            {products.length > 0 && (
              <Button variant="destructive" onClick={clearWishlist}>
                Clear All
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
          {products.map(product => (
            <Card key={product._id} className="relative group overflow-hidden">
              <button
                className="absolute top-2 right-2 z-10 p-1 rounded-full bg-white shadow-md hover:bg-gray-100"
                onClick={() => removeItem(product._id)}
              >
                <X className="h-4 w-4" />
              </button>

              <Link href={`/products/${product._id}`}>
                <div className="relative aspect-square bg-gray-100">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-contain p-4"
                  />
                </div>
              </Link>

              <div className="p-4">
                <Link
                  href={`/products/${product._id}`}
                  className="hover:underline"
                >
                  <h3 className="font-medium line-clamp-2 mb-2">
                    {product.name}
                  </h3>
                </Link>

                <div className="flex items-center mb-3">
                  <span>⭐</span>
                  <span className="text-sm text-muted-foreground ml-1">
                    {product.rating.toFixed(1)} ({product.numReviews})
                  </span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <p className="text-lg font-bold">${product.price}</p>
                  {product.countInStock > 0 ? (
                    <span className="text-xs text-green-600 font-medium">
                      In Stock
                    </span>
                  ) : (
                    <span className="text-xs text-red-500 font-medium">
                      Out of Stock
                    </span>
                  )}
                </div>

                <Button
                  className="w-full"
                  onClick={() => handleAddToCart(product._id)}
                  disabled={product.countInStock === 0}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Container>
  );
}
