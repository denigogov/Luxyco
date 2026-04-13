import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { OrdersCreateService } from './order.create.service';
import { PrintModule } from 'src/infrastructure/printing/print.module';

@Module({
  imports: [DatabaseModule, PrintModule],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersCreateService],
})
export class OrdersModule {}
