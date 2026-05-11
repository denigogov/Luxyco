import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { OrdersCreateService } from './order.create.service';
import { PrintModule } from 'src/infrastructure/printing/print.module';
import { OrdersDetailService } from './order.detail.service';
import { OrdersUpdateService } from './order.update.services';

@Module({
  imports: [DatabaseModule, PrintModule],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    OrdersCreateService,
    OrdersDetailService,
    OrdersUpdateService,
  ],
})
export class OrdersModule {}
