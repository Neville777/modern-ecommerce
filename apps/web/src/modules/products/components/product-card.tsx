'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@apps/shared/types';
import { formatPrice, cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useCart } from '@/modules/cart/context/cart-context';
import { useWishlist } from '@/modules/wishlist/context/wishlist-context';
import { useCompare } from '@/modules/compare/context/compare-context';
import { Eye, Heart, RefreshCw, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductCardProps {
  product: Product;
  onQuickView?: (productId: string) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addItem, loading } = useCart();
  const { addItem: addToWishlist, isInWishlist } = useWishlist();
  const { addItem: addToCompare, isInCompare } = useCompare();
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Get primary and alternate image (could be different color)
  const primaryImage = product.images[0];
  const alternateImage =
    product.images.length > 1 ? product.images[1] : product.images[0];

  const handleAddToCart = async () => {
    if (!product?._id) {
      console.error('Invalid product ID');
      return;
    }

    try {
      setIsAdding(true);
      await addItem(product._id, 1);
      toast({
        title: 'Added to cart',
        description: `${product.name} has been added to your cart`,
      });
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to add item to cart',
        variant: 'destructive',
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    try {
      await addItem(product._id, 1);
      window.location.href = '/cart';
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add item to cart',
        variant: 'destructive',
      });
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToWishlist(product._id);
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCompare(product._id);
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product._id);
  };

  const isWishlisted = isInWishlist(product._id);
  const isCompared = isInCompare(product._id);

  // Format the discount percentage
  const discountPercentage = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  return (
    <Card
      className="group relative overflow-hidden border rounded-md transition-all duration-300 hover:shadow-lg dark:border-gray-700 dark:hover:shadow-gray-800/50 h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product image with transition effect */}
      <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
        <Link href={`/products/${product._id || ''}`} className="block h-full">
          <div className="relative h-full w-full">
            {/* Primary Image */}
            <div
              className={cn(
                'absolute inset-0 transition-opacity duration-500',
                isHovered ? 'opacity-0' : 'opacity-100',
              )}
            >
              <Image
                src={primaryImage}
                alt={product.name || 'Product'}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover object-center"
                priority
              />
            </div>

            {/* Alternate Image (shown on hover) */}
            <div
              className={cn(
                'absolute inset-0 transition-opacity duration-500',
                isHovered ? 'opacity-100' : 'opacity-0',
              )}
            >
              <Image
                src={alternateImage}
                alt={`${product.name} - alternate view`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover object-center"
              />
            </div>
          </div>

          {/* Action buttons (heart, compare, eye) - only visible on hover */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
            <AnimatePresence>
              {isHovered && (
                <>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Button
                      variant="secondary"
                      size="icon"
                      className={cn(
                        'rounded-full shadow-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 hover:text-red-600 w-8 h-8',
                        isWishlisted &&
                          'bg-white dark:bg-gray-700 text-red-600',
                      )}
                      onClick={handleWishlistClick}
                      title={
                        isWishlisted
                          ? 'Remove from wishlist'
                          : 'Add to wishlist'
                      }
                    >
                      <Heart
                        className={cn(
                          'h-4 w-4 text-gray-800 dark:text-gray-200',
                          isWishlisted && 'fill-current text-red-600',
                        )}
                      />
                    </Button>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <Button
                      variant="secondary"
                      size="icon"
                      className={cn(
                        'rounded-full shadow-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 hover:text-blue-600 w-8 h-8',
                        isCompared && 'bg-white dark:bg-gray-700 text-blue-600',
                      )}
                      onClick={handleCompareClick}
                      title={
                        isCompared ? 'Remove from compare' : 'Add to compare'
                      }
                    >
                      <RefreshCw
                        className={cn(
                          'h-4 w-4 text-gray-800 dark:text-gray-200',
                          isCompared && 'text-blue-600',
                        )}
                      />
                    </Button>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <Button
                      variant="secondary"
                      size="icon"
                      className="rounded-full shadow-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 hover:text-purple-600 w-8 h-8"
                      onClick={handleQuickViewClick}
                      title="Quick view"
                    >
                      <Eye className="h-4 w-4 text-gray-800 dark:text-gray-200" />
                    </Button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Discount or Sale badge */}
          {discountPercentage > 0 ? (
            <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-medium px-2 py-1 rounded-md">
              {discountPercentage}% OFF
            </div>
          ) : (
            product.countInStock > 0 && (
              <div className="absolute top-2 left-2 bg-green-600 text-white text-xs font-medium px-2 py-1 rounded-md">
                Sale
              </div>
            )
          )}

          {/* Out of Stock badge */}
          {product.countInStock === 0 && (
            <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-medium px-2 py-1 rounded-md">
              Out of Stock
            </div>
          )}
        </Link>
      </div>

      {/* Product info */}
      <CardContent className="relative pt-4">
        <Link
          href={`/products/${product._id || ''}`}
          className="text-base font-medium hover:underline line-clamp-2 text-gray-900 dark:text-gray-100"
        >
          {product.name || 'Unnamed Product'}
        </Link>

        <div className="mt-2 flex items-center gap-2">
          <div className="font-bold text-red-600 dark:text-red-400">
            {formatPrice(product.price || 0)}
          </div>

          {product.oldPrice && (
            <div className="text-sm text-gray-500 dark:text-gray-400 line-through">
              {formatPrice(product.oldPrice)}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center">
            {/* Product rating */}
            {product.rating && (
              <div className="flex items-center">
                <svg
                  className="h-4 w-4 text-yellow-400 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {product.rating} ({product.numReviews})
                </span>
              </div>
            )}
          </div>
        </div>
      </CardFooter>

      {/* Buttons container with animated popup effect */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute bottom-0 inset-x-0 flex flex-col gap-2 p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Quick View button - animated on hover */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0 }}
            >
              <Button
                variant="outline"
                className="w-full border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={handleQuickViewClick}
              >
                <Eye className="h-4 w-4 mr-2" />
                Quick View
              </Button>
            </motion.div>

            {/* Add to Cart button - animated on hover */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Button
                variant="default"
                className="w-full"
                onClick={handleAddToCart}
                disabled={isAdding || loading || !product.countInStock}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {isAdding ? 'Adding...' : 'Add to Cart'}
              </Button>
            </motion.div>

            {/* Buy Now button - animated on hover */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Button
                variant="default"
                className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                onClick={handleBuyNow}
                disabled={isAdding || loading || !product.countInStock}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Buy Now
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
