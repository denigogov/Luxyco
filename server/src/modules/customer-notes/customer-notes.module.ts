import { Module } from '@nestjs/common';
import { CustomerNotesService } from './customer-notes.service';
import { CustomerNotesController } from './customer-notes.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [CustomerNotesController],
  providers: [CustomerNotesService],
})
export class CustomerNotesModule {}
