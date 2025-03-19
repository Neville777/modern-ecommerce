import { Module } from '@nestjs/common';
import { ProductsService } from './services/products.service';
import { ProductsController } from './controller/products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/product.schema';
import { AppService } from '@/app/services/app.service';
import { CloudinaryModule } from '@/cloudinary/cloudinary.module';
import { AiModule } from '@/ai/ai.module';
import { ProductExpertAgent } from '@/ai/agents/product-expert.agent';
import { Order, OrderSchema } from '@/orders/schemas/order.schema'; 
import { ProductSeedCommand } from '@/users/commands/product-seed.command';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Product.name,
        schema: ProductSchema,
      },
      {
        name: Order.name,
        schema: OrderSchema,
      },
    ]),
    CloudinaryModule,
    AiModule,
  ],
  providers: [
    ProductsService,
    AppService,
    ProductExpertAgent,
    ProductSeedCommand, // Add this
  ],
  controllers: [ProductsController],
  exports: [ProductsService],
})
export class ProductsModule {}
