import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthController } from "./auth/auth.controller";
import { NotificationsController } from "./notifications/notifications.controller";
import { OrdersController } from "./orders/orders.controller";
import { PlatformStore } from "./platform.store";
import { ProductsController } from "./products/products.controller";
import { ServicesController } from "./services/services.controller";
import { UsersController } from "./users/users.controller";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [
    AppController,
    AuthController,
    ProductsController,
    ServicesController,
    OrdersController,
    UsersController,
    NotificationsController,
  ],
  providers: [AppService, PlatformStore],
})
export class AppModule {}
