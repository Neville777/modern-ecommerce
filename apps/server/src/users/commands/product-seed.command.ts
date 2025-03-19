import { Command } from 'nestjs-command';
import { Injectable, Logger } from '@nestjs/common';
import { generateProducts } from '@/utils/data/products';
import { ProductsService } from '@/products/services/products.service';

@Injectable()
export class ProductSeedCommand {
  private readonly logger = new Logger(ProductSeedCommand.name);

  constructor(private readonly productsService: ProductsService) {}

  @Command({
    command: 'products:seed',
    describe: 'Seed products into the database',
  })
  async seed() {
    try {
      // First, delete existing products
      await this.productsService.deleteMany();

      // Generate product data
      const productData = generateProducts(12);

      // Prepare product data - use existing image URLs directly
      const preparedProducts = productData.map(product => {
        // Make sure we have a non-empty images array
        const images =
          product.images && product.images.length > 0
            ? product.images
            : [
                `https://via.placeholder.com/800x600?text=${encodeURIComponent(product.name)}`,
              ];

        // Use the first image as brand logo if not provided
        const brandLogo = images[0];

        return {
          ...product,
          images,
          brandLogo,
        };
      });

      // Create products
      const products = await this.productsService.createMany(preparedProducts);

      this.logger.log('Products seeded successfully:');
      products.forEach(product => {
        this.logger.log(
          `Product - Name: ${product.name}, Brand: ${product.brand}, Price: $${product.price}`,
        );
      });

      process.exit(0);
    } catch (error) {
      this.logger.error('Error seeding products:', error);
      process.exit(1);
    }
  }
}
