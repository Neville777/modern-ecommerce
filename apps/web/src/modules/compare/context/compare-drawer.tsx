// /src/modules/compare/components/compare-drawer.tsx
import { useCompare } from '@/modules/compare/context/compare-context';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/modules/cart/context/cart-context';
import { useToast } from '@/hooks/use-toast';

interface CompareDrawerProps {
  trigger: React.ReactNode;
}

export function CompareDrawer({ trigger }: CompareDrawerProps) {
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

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg md:max-w-xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Product Comparison ({products.length})</DialogTitle>
        </DialogHeader>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10">
            <p className="text-muted-foreground text-center mb-4">
              No products added to comparison yet.
            </p>
            <DialogClose asChild>
              <Button variant="outline">Continue Shopping</Button>
            </DialogClose>
          </div>
        ) : (
          <div className="mt-6 flex flex-col">
            <div className="overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                {products.map(product => (
                  <div
                    key={product._id}
                    className="relative border rounded-lg p-4"
                  >
                    <button
                      className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200"
                      onClick={() => removeItem(product._id)}
                    >
                      <X className="h-4 w-4" />
                    </button>

                    <div className="relative aspect-square mb-4">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-contain"
                      />
                    </div>

                    <h3 className="font-medium line-clamp-2 mb-2">
                      {product.name}
                    </h3>

                    <p className="text-lg font-bold mb-3">${product.price}</p>

                    <div className="space-y-1 text-sm mb-4">
                      <p>
                        <span className="font-medium">Brand:</span>{' '}
                        {product.brand}
                      </p>
                      <p>
                        <span className="font-medium">Category:</span>{' '}
                        {product.category}
                      </p>
                      <p>
                        <span className="font-medium">Rating:</span>{' '}
                        {product.rating.toFixed(1)}
                      </p>
                      {product.countInStock > 0 ? (
                        <p className="text-green-600">In Stock</p>
                      ) : (
                        <p className="text-red-500">Out of Stock</p>
                      )}
                    </div>

                    <div className="space-x-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/products/${product._id}`}>
                          View Details
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(product._id)}
                        disabled={product.countInStock === 0}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter className="mt-4 flex justify-between gap-2">
              <Button
                variant="destructive"
                onClick={clearCompare}
                className="w-full sm:w-auto"
              >
                Clear All
              </Button>
              <DialogClose asChild>
                <Button variant="secondary" className="w-full sm:w-auto">
                  Close
                </Button>
              </DialogClose>
              <Button className="w-full sm:w-auto" asChild>
                <Link href="/compare">Full Compare View</Link>
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
