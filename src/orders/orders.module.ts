import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { AdminOrdersController } from './admin-orders.controller';
import { Order, OrderSchema } from './schemas/order.schema';
import { OrderItem, OrderItemSchema } from './schemas/order-item.schema';
import { Cart, CartSchema } from '../carts/schemas/cart.schema';
import { CartItem, CartItemSchema } from '../carts/schemas/cart-item.schema';
import { Product, ProductSchema } from '../products/schemas/product.schema';
import { Session, SessionSchema } from '../sessions/schemas/session.schema';
import { Table, TableSchema } from '../tables/schemas/table.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: OrderItem.name, schema: OrderItemSchema },
      { name: Cart.name, schema: CartSchema },
      { name: CartItem.name, schema: CartItemSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Session.name, schema: SessionSchema },
      { name: Table.name, schema: TableSchema },
    ]),
  ],
  controllers: [OrdersController, AdminOrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
