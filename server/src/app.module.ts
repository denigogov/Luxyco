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
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api*'],
    }),

    AppConfigModule,
    UsersModule,
    CustomersModule,
    CustomerAddressesModule,
    AuthModule,
    CustomerNotesModule,
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
