import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getProduct } from '@/modules/products/actions/get-product';
import { ProductDetails } from '@/modules/products/components/product-details';
import { Container } from '@/components/ui/container';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  // Ensure id exists
  if (!params?.id) {
    return (
      <Container>
        <div className="py-10 text-center">
          <h1 className="text-2xl font-bold">Invalid Product ID</h1>
          <p className="mt-2">The product ID is missing or invalid.</p>
        </div>
      </Container>
    );
  }

  const product = await getProduct(params.id);

  // If product not found, use notFound()
  if (!product) {
    notFound();
  }

  return (
    <Container>
      <Suspense fallback={<div>Loading product details...</div>}>
        <ProductDetails product={product} />
      </Suspense>
    </Container>
  );
}
