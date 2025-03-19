// app/page.tsx
import { Suspense } from 'react';
import { Container } from '@/components/ui/container';
import { ProductGrid } from '@/modules/products/components/product-grid';
import { getProducts } from '@/modules/products/actions/get-products';
import { HeroCarousel } from '@/components/hero-carousel';

interface HomePageProps {
  searchParams: { page?: string };
}

export default async function Home({ searchParams }: HomePageProps) {
  const { page } = searchParams;
  const currentPage = Number(page) || 1;
  const { items: products, pages } = await getProducts(currentPage, 10);

  return (
    <div className="flex flex-col w-full">
      {/* Hero Carousel Section - Responsive height based on screen size */}
      <Suspense
        fallback={
          <div className="h-[300px] md:h-[400px] lg:h-[500px] w-full bg-gray-200 dark:bg-gray-800 animate-pulse rounded-b-lg"></div>
        }
      >
        <div className="w-full">
          <HeroCarousel />
        </div>
      </Suspense>

      {/* Categories Section - Added dark mode support */}
      <div className="bg-gray-100 dark:bg-gray-800 py-6 md:py-8 text-center mt-4">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-gray-100">
          Phones
        </h2>
      </div>

      {/* Products Section - Improved spacing and responsive layout with dark mode */}
      <Container className="mt-6 md:mt-10">
        <div className="space-y-4 md:space-y-6 pb-6 md:pb-10">
          <div className="flex flex-col gap-y-4 md:gap-y-8 px-1 sm:px-2 lg:px-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold dark:text-white">
                Latest Products
              </h1>
              <a
                href="/products"
                className="text-sm md:text-base text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:underline"
              >
                View All
              </a>
            </div>
            <ProductGrid products={products} currentPage={currentPage} />
          </div>
        </div>
      </Container>

      {/* Mobile-optimized promotional banner - maintained across themes */}
      <div className="bg-red-600 dark:bg-red-700 text-white py-4 md:py-6 px-4 md:px-8 my-6 rounded-none md:rounded-lg mx-0 md:mx-4 lg:mx-8">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0 text-center md:text-left">
              <h3 className="text-lg md:text-xl font-bold mb-2">
                Special Offer
              </h3>
              <p className="text-sm md:text-base">
                Get 10% off your first purchase with code: NEVOS10
              </p>
            </div>
            <button className="bg-white text-red-600 hover:bg-gray-100 dark:bg-gray-100 dark:hover:bg-gray-200 px-6 py-2 rounded-full text-sm md:text-base font-medium transition-colors duration-200">
              Shop Now
            </button>
          </div>
        </Container>
      </div>

      {/* Mobile app promotion for bottom of page - with dark mode support */}
      <div className="bg-gray-100 dark:bg-gray-800 py-6 md:py-8 mt-auto">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h3 className="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                Download Our App
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Shop easier and faster with our mobile app
              </p>
            </div>
            <div className="flex space-x-4">
              <button className="bg-black dark:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm flex items-center hover:bg-gray-800 dark:hover:bg-black transition-colors duration-200">
                <span className="mr-2">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                App Store
              </button>
              <button className="bg-black dark:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm flex items-center hover:bg-gray-800 dark:hover:bg-black transition-colors duration-200">
                <span className="mr-2">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M5 3L19 12L5 21V3Z" fill="currentColor" />
                  </svg>
                </span>
                Google Play
              </button>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
