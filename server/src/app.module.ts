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

@Module({
  imports: [
    AppConfigModule,
    UsersModule,
    CustomersModule,
    CustomerAddressesModule,
    AuthModule,
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
