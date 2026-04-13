import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { keysToCamel } from 'src/common/utils/camel-case.util';
import { PrintGateway } from './print.gateway';

@Injectable()
export class PrintEventsService {
  private readonly logger = new Logger(PrintEventsService.name);

  constructor(
    private readonly printGateway: PrintGateway,
    private readonly configService: ConfigService,
  ) {}

  emitOrderCreated(order: unknown) {
    const mode = this.configService.get<string>('printing.mode', 'manual');
    if (mode !== 'automatic') {
      this.logger.debug(
        `Skipping print event broadcast because PRINT_MODE=${mode}`,
      );
      return;
    }

    try {
      const sentClients = this.printGateway.broadcast({
        event: 'order.created',
        order: keysToCamel(order),
      });
      this.logger.log(`Broadcasted order.created to ${sentClients} client(s)`);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unknown print emit error';
      this.logger.error(`Failed to emit print event: ${message}`);
    }
  }
}
