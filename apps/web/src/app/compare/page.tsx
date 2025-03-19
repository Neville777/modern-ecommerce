'use client';

import { Container } from '@/components/ui/container';
import { useCompare } from '@/modules/compare/context/compare-context';
import { Button } from '@/components/ui/button';
import { X, ArrowLeft, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/modules/cart/context/cart-context';
import { useToast } from '@/hooks/use-toast';

export default function ComparePage() {
  const { products, removeItem, clearCompare } = useCompare();
  const { addItem } = useCart();
  const { toast } = useToast();

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

  // Extract all feature keys from products
  const allSpecs =
    products.length > 0
      ? [
          'brand',
          'category',
          'price',
          'rating',
          'countInStock',
          // Add any other common specifications you want to compare
        ]
      : [];

  if (products.length === 0) {
    return (
      <Container>
        <div className="py-10 text-center">
          <h1 className="text-3xl font-bold mb-6">Product Comparison</h1>
          <p className="text-muted-foreground mb-6">
            No products added for comparison yet.
          </p>
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
          <h1 className="text-3xl font-bold">Product Comparison</h1>
          <div className="space-x-4">
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Link>
            </Button>
            <Button variant="destructive" onClick={clearCompare}>
              Clear All
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-4 text-left border-b w-1/4">Specification</th>
                {products.map(product => (
                  <th key={product._id} className="p-4 border-b">
                    <div className="relative">
                      <button
                        className="absolute -top-2 -right-2 p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                        onClick={() => removeItem(product._id)}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Product Image */}
              <tr>
                <td className="p-4 font-medium border-b">Product</td>
                {products.map(product => (
                  <td key={product._id} className="p-4 text-center border-b">
                    <div className="flex flex-col items-center">
                      <div className="relative w-40 h-40 mx-auto">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <Link
                        href={`/products/${product._id}`}
                        className="mt-2 font-medium hover:underline line-clamp-2 text-center"
                      >
                        {product.name}
                      </Link>
                      <Button
                        className="mt-3"
                        onClick={() => handleAddToCart(product._id)}
                        disabled={product.countInStock === 0}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Price */}
              <tr>
                <td className="p-4 font-medium border-b">Price</td>
                {products.map(product => (
                  <td
                    key={product._id}
                    className="p-4 text-center border-b font-bold"
                  >
                    ${product.price}
                  </td>
                ))}
              </tr>

              {/* Brand */}
              <tr>
                <td className="p-4 font-medium border-b">Brand</td>
                {products.map(product => (
                  <td key={product._id} className="p-4 text-center border-b">
                    {product.brand}
                  </td>
                ))}
              </tr>

              {/* Category */}
              <tr>
                <td className="p-4 font-medium border-b">Category</td>
                {products.map(product => (
                  <td key={product._id} className="p-4 text-center border-b">
                    {product.category}
                  </td>
                ))}
              </tr>

              {/* Rating */}
              <tr>
                <td className="p-4 font-medium border-b">Rating</td>
                {products.map(product => (
                  <td key={product._id} className="p-4 text-center border-b">
                    <div className="flex items-center justify-center">
                      <span>⭐</span>
                      <span>
                        {product.rating.toFixed(1)} ({product.numReviews}{' '}
                        reviews)
                      </span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Availability */}
              <tr>
                <td className="p-4 font-medium border-b">Availability</td>
                {products.map(product => (
                  <td key={product._id} className="p-4 text-center border-b">
                    {product.countInStock > 0 ? (
                      <span className="text-green-600">In Stock</span>
                    ) : (
                      <span className="text-red-500">Out of Stock</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Description */}
              <tr>
                <td className="p-4 font-medium border-b">Description</td>
                {products.map(product => (
                  <td key={product._id} className="p-4 text-center border-b">
                    <p className="line-clamp-4">{product.description}</p>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Container>
  );
}
