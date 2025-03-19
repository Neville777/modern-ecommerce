'use client';

// File: components/hero-carousel.tsx
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CarouselSlide {
  id: number;
  type: 'product' | 'promotion';
  title?: string;
  subtitle?: string;
  productName?: string;
  brand?: string;
  description?: string;
  backgroundImage: string;
  productImage?: string; // Optional product image for the right side
  buttonText: string;
  buttonLink: string;
  backgroundColor?: string;
  textColor?: string;
  textAlignment?: 'left' | 'center';
}

interface HeroCarouselProps {
  slides?: CarouselSlide[];
  autoPlayInterval?: number;
}

export function HeroCarousel({
  slides = defaultSlides,
  autoPlayInterval = 5000,
}: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToNextSlide = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex(prevIndex =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1,
    );

    // Reset transition state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  }, [slides.length]);

  const goToPrevSlide = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex(prevIndex =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1,
    );

    // Reset transition state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  }, [slides.length]);

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(() => {
      goToNextSlide();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [goToNextSlide, autoPlayInterval]);

  if (!slides || slides.length === 0) {
    return null;
  }

  const currentSlide = slides[currentIndex];

  return (
    <div className="relative w-full overflow-hidden">
      {/* Main carousel container */}
      <div
        className={cn(
          'relative w-full h-[450px] sm:h-[500px] md:h-[550px] lg:h-[600px] xl:h-[650px]',
          currentSlide.backgroundColor || 'bg-black',
        )}
      >
        {/* Background for promotional slides */}
        {currentSlide.type === 'promotion' && (
          <div className="absolute inset-0 z-0">
            <Image
              src={currentSlide.backgroundImage}
              alt={currentSlide.title || 'Promotional slide'}
              fill
              priority
              sizes="100vw"
              className={cn(
                'object-cover transition-opacity duration-500',
                isTransitioning ? 'opacity-40' : 'opacity-100',
              )}
            />
          </div>
        )}

        <div className="container mx-auto h-full flex flex-col md:flex-row items-center">
          {/* Left side: Text content */}
          <div
            className={cn(
              'w-full md:w-2/5 px-6 py-10 md:py-0 z-10 transition-all duration-500',
              currentSlide.textColor || 'text-white',
              isTransitioning
                ? 'opacity-0 translate-y-4'
                : 'opacity-100 translate-y-0',
              currentSlide.type === 'promotion'
                ? 'text-center md:text-center'
                : 'text-left md:text-left',
            )}
          >
            {currentSlide.type === 'product' ? (
              // Product slide layout
              <>
                {currentSlide.brand && (
                  <p className="uppercase tracking-wider mb-2 text-sm font-semibold">
                    {currentSlide.brand}
                  </p>
                )}
                {currentSlide.productName && (
                  <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                    {currentSlide.productName}
                  </h2>
                )}
                {currentSlide.description && (
                  <p className="text-lg md:text-xl mb-8 leading-relaxed max-w-md">
                    {currentSlide.description}
                  </p>
                )}
                <Link href={currentSlide.buttonLink}>
                  <Button className="bg-red-600 hover:bg-red-700 text-white border-0 px-8 py-3 text-lg rounded-sm">
                    {currentSlide.buttonText}
                  </Button>
                </Link>
              </>
            ) : (
              // Promotional slide layout
              <>
                {currentSlide.title && (
                  <h2 className="text-5xl md:text-7xl font-bold mb-6 tracking-wide uppercase">
                    {currentSlide.title}
                  </h2>
                )}
                {currentSlide.subtitle && (
                  <h3 className="text-3xl md:text-5xl font-bold mb-10 uppercase tracking-wider">
                    {currentSlide.subtitle}
                  </h3>
                )}
                <Link href={currentSlide.buttonLink} className="inline-block">
                  <Button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 text-lg uppercase font-medium">
                    {currentSlide.buttonText}
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Right side: Image for product slides */}
          <div
            className={cn(
              'w-full md:w-3/5 h-full relative transition-all duration-500 z-5 flex items-center',
              isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100',
            )}
          >
            {currentSlide.type === 'product' ? (
              // Product image for product slides - Adjusted for better positioning
              <div className="relative w-full h-full flex items-center justify-end">
                {currentSlide.backgroundImage.includes('Slide-B.png') ? (
                  // For Samsung slide (special case)
                  <div className="absolute right-0 bottom-0 w-full h-[70%] flex justify-end items-end">
                    <Image
                      src={currentSlide.backgroundImage}
                      alt={currentSlide.productName || 'Product image'}
                      width={500}
                      height={500}
                      className="object-contain object-right-bottom transform translate-y-[-40px]"
                    />
                  </div>
                ) : (
                  // For other product slides
                  <Image
                    src={currentSlide.backgroundImage}
                    alt={currentSlide.productName || 'Product image'}
                    width={600}
                    height={600}
                    className="object-contain object-right transform translate-y-0"
                  />
                )}
              </div>
            ) : (
              // For promotional slides, we can either leave this empty or add a visual element
              <div className="h-full flex items-center justify-center">
                {/* Optional decorative elements for promo slides */}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={goToPrevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white w-10 h-10 flex items-center justify-center rounded-full z-20"
        aria-label="Previous slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      <button
        onClick={goToNextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white w-10 h-10 flex items-center justify-center rounded-full z-20"
        aria-label="Next slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              'h-3 rounded-full transition-all',
              currentIndex === index ? 'bg-white w-8' : 'bg-white/50 w-3',
            )}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
}

// Default slides based on the provided images
const defaultSlides: CarouselSlide[] = [
  {
    id: 1,
    type: 'product',
    brand: 'IPHONE',
    productName: '16 Pro Max',
    description:
      'So fast. So fluid. Get a feel for the all-new Camera Control.',
    backgroundImage:
      'https://accesspress.co.ke/wp-content/uploads/2025/02/Slide-A.png',
    buttonText: 'Shop Now',
    buttonLink: '/products/iphone-16-pro-max',
    textAlignment: 'left',
    backgroundColor: 'bg-black',
    textColor: 'text-white',
  },
  {
    id: 2,
    type: 'product',
    brand: 'SAMSUNG',
    productName: 'Simple Impactful',
    description:
      "Ring in the next era of mobile AI with an AI companion who's one step ahead of your every need",
    backgroundImage:
      'https://accesspress.co.ke/wp-content/uploads/2025/02/Slide-B.png',
    buttonText: 'Buy Now',
    buttonLink: '/products/samsung-galaxy-s25',
    textAlignment: 'left',
    backgroundColor: 'bg-white',
    textColor: 'text-black',
  },
  {
    id: 3,
    type: 'promotion',
    title: 'GET START',
    subtitle: 'YOUR FAVORITE SHOPPING',
    backgroundImage:
      'https://accesspress.co.ke/wp-content/uploads/2025/02/Slide-C-1.png',
    buttonText: 'BUY NOW',
    buttonLink: '/products',
    textAlignment: 'center',
    backgroundColor: 'bg-amber-400',
    textColor: 'text-white',
  },
];
