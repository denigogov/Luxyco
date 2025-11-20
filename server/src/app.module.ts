// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config/config.module';
import { UsersModule } from './modules/users/users.module';
import { CustomersModule } from './modules/customers/customers.module';

@Module({
  imports: [AppConfigModule, UsersModule, CustomersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
