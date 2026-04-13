import { Module } from '@nestjs/common';
import { PrintEventsService } from './print-events.service';
import { PrintGateway } from './print.gateway';

@Module({
  providers: [PrintGateway, PrintEventsService],
  exports: [PrintEventsService],
})
export class PrintModule {}
