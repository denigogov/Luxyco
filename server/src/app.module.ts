// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config/config.module';
import { UsersModule } from './modules/users/users.module';
import { CustomersModule } from './modules/customers/customers.module';
import { CustomerAddressesModule } from './modules/customer-addresses/customer-addresses.module';
import { AuthModule } from './modules/auth/auth.module';
import { CamelCaseResponseInterceptor } from './common/interceptors/camel-case-response.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CustomerNotesModule } from './modules/customer-notes/customer-notes.module';
import { OrdersModule } from './modules/orders/orders.module';
import { RedisModule } from './infrastructure/cache/redis.module';
import { StatusModule } from './modules/status/status.module';
import { DeliveryTypeModule } from './modules/delivery-type/delivery-type.module';
import { ServiceTypeModule } from './modules/service-type/service-type.module';
import { PrintModule } from './infrastructure/printing/print.module';

@Module({
  imports: [
    AppConfigModule,
    UsersModule,
    CustomersModule,
    CustomerAddressesModule,
    AuthModule,
    CustomerNotesModule,
    OrdersModule,
    RedisModule,
    StatusModule,
    DeliveryTypeModule,
    ServiceTypeModule,
    PrintModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CamelCaseResponseInterceptor,
    },
  ],
})
export class AppModule {}
