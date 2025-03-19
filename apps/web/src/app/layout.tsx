import type { Metadata } from 'next';
import { satoshi } from './fonts';
import './globals.css';

import { Header } from '@/components/header';
import { Providers } from './providers';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/components/auth-provider';
import { CartProvider } from '@/modules/cart/context/cart-context';
import { CheckoutProvider } from '@/modules/checkout/context/checkout-context';
import { ThemeProvider } from '@/components/theme-provider';
import { WishlistProvider } from '@/modules/wishlist/context/wishlist-context';
import { CompareProvider } from '@/modules/compare/context/compare-context';

export const metadata: Metadata = {
  title: 'Nevos shop',
  description: 'Modern eCommerce platform',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  themeColor: '#ef4444', // Red-600 color for theme
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Nevos Shop',
  },
  formatDetection: {
    telephone: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Add preconnect to improve performance of external resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Add touch icon for iOS */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
      </head>
      <body
        className={`${satoshi.variable} antialiased min-h-screen flex flex-col text-base`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <AuthProvider>
              <CartProvider>
                <WishlistProvider>
                  <CompareProvider>
                    <CheckoutProvider>
                      <Header />
                      <main className="flex-1 w-full">{children}</main>
                      <Toaster />
                    </CheckoutProvider>
                  </CompareProvider>
                </WishlistProvider>
              </CartProvider>
            </AuthProvider>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
