import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { SharedAuthModule } from './auth/shared-auth.module';
import { TablesModule } from './tables/tables.module';
import { ProductsModule } from './products/products.module';
import { CategoryModule } from './category/category.module';
import { SessionsModule } from './sessions/sessions.module';
import { CartsModule } from './carts/carts.module';
import { OrdersModule } from './orders/orders.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI || ''),
    SharedAuthModule,
    AuthModule,
    TablesModule,
    ProductsModule,
    CategoryModule,
    SessionsModule,
    CartsModule,
    OrdersModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
