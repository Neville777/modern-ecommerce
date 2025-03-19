'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Product } from '@apps/shared/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useCart } from '@/modules/cart/context/cart-context';
import { StarIcon, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickViewModal({
  product,
  isOpen,
  onClose,
}: QuickViewModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addItem } = useCart();
  const { toast } = useToast();

  if (!product) return null;

  const handleAddToCart = async () => {
    try {
      await addItem(product._id, quantity);
      toast({
        title: 'Added to cart',
        description: `${product.name} has been added to your cart`,
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add item to cart',
        variant: 'destructive',
      });
    }
  };

  const isOutOfStock = product.countInStock === 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-white dark:bg-gray-800 p-1 shadow-md"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>

        <div className="grid grid-cols-2 gap-0 md:grid-cols-1">
          {/* Product image */}
          <div className="bg-gray-100 dark:bg-gray-900 p-8 flex items-center justify-center aspect-square relative">
            <Image
              src={product.images[currentImageIndex]}
              alt={product.name}
              fill
              className="object-contain"
            />

            {/* Thumbnail navigation */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 flex-wrap px-2">
              {product.images.slice(0, 4).map((image, index) => (
                <button
                  key={index}
                  className={`w-16 h-16 border-2 ${
                    currentImageIndex === index
                      ? 'border-red-600 dark:border-red-500'
                      : 'border-transparent'
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={image}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Product details */}
          <div className="p-6 flex flex-col">
            <DialogHeader className="text-left">
              <DialogTitle className="text-2xl font-bold">
                {product.name}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ({product.numReviews} reviews)
                </span>
              </div>
            </DialogHeader>

            <div className="text-3xl font-bold mt-4 text-red-600 dark:text-red-500">
              {formatPrice(product.price)}
            </div>

            <div className="mt-4 text-sm text-gray-600 dark:text-gray-300 line-clamp-4">
              {product.description}
            </div>

            <div className="flex flex-wrap items-end gap-4 mt-6">
              <div>
                <p className="text-sm font-medium mb-1">Quantity</p>
                <Select
                  value={quantity.toString()}
                  onValueChange={value => setQuantity(Number(value))}
                  disabled={isOutOfStock}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Qty" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from(
                      { length: Math.min(10, product.countInStock || 0) },
                      (_, i) => i + 1,
                    ).map(num => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <Button
                  className="w-full bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                >
                  {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </Button>
              </div>
            </div>

            <div className="mt-auto pt-6">
              <Link
                href={`/products/${product._id}`}
                className="text-red-600 dark:text-red-500 hover:underline text-sm font-medium"
                onClick={onClose}
              >
                View Full Details
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
