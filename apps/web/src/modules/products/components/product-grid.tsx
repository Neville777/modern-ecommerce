'use client';

import { useState } from 'react';
import { Product } from '@apps/shared/types';
import { ProductCard } from './product-card';
import { ProductCardSkeleton } from './product-card-skeleton';
import { useEffect } from 'react';
import { getProducts } from '../actions/get-products';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import { getVisiblePages } from '@/lib/utils';
import { QuickViewModal } from './quick-view-modal';
import { useToast } from '@/hooks/use-toast';

interface ProductGridProps {
  products?: Product[];
  searchKeyword?: string;
  currentPage?: number;
}

export function ProductGrid({
  products: initialProducts,
  searchKeyword,
  currentPage = 1,
}: ProductGridProps) {
  const [products, setProducts] = useState(initialProducts);
  const [pages, setPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (searchKeyword) {
      setIsLoading(true);
      const fetchSearchResults = async () => {
        try {
          const { items, pages: totalPages } = await getProducts(
            currentPage,
            10,
            searchKeyword,
          );
          setProducts(items);
          setPages(totalPages);
        } catch (error) {
          console.error('Failed to search products:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchSearchResults();
    } else {
      setProducts(initialProducts);
    }
  }, [searchKeyword, currentPage, initialProducts]);

  const handleQuickView = (productId: string) => {
    const product = products?.find(p => p._id === productId) || null;
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleAddToWishlist = (productId: string) => {
    // This would be connected to a wishlist context or API call
    toast({
      title: 'Added to Wishlist',
      description: 'Product has been added to your wishlist',
    });
  };

  const handleAddToCompare = (productId: string) => {
    // This would be connected to a compare context or API call
    toast({
      title: 'Added to Compare',
      description: 'Product has been added to comparison list',
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!products?.length) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No products found</p>
      </div>
    );
  }

  const visiblePages = getVisiblePages(currentPage, pages);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6">
        {products.map(product => (
          <ProductCard
            key={product._id}
            product={product}
            onQuickView={handleQuickView}
            onAddToWishlist={handleAddToWishlist}
            onAddToCompare={handleAddToCompare}
          />
        ))}
      </div>

      {pages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination>
            <PaginationContent className="flex-wrap justify-center">
              <PaginationItem className="hidden sm:block">
                <PaginationPrevious
                  href={
                    searchKeyword
                      ? `/search/${searchKeyword}?page=${currentPage - 1}`
                      : `/?page=${currentPage - 1}`
                  }
                  isActive={currentPage > 1}
                />
              </PaginationItem>

              {visiblePages.map((pageNum, idx) =>
                pageNum === null ? (
                  <PaginationItem key={`ellipsis-${idx}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href={
                        searchKeyword
                          ? `/search/${searchKeyword}?page=${pageNum}`
                          : `/?page=${pageNum}`
                      }
                      isActive={currentPage === pageNum}
                      className="text-xs sm:text-sm"
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}

              <PaginationItem className="hidden sm:block">
                <PaginationNext
                  href={
                    searchKeyword
                      ? `/search/${searchKeyword}?page=${currentPage + 1}`
                      : `/?page=${currentPage + 1}`
                  }
                  isActive={currentPage < pages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Quick View Modal */}
      <QuickViewModal
        product={selectedProduct}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </div>
  );
}
