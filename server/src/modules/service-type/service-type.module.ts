import { Module } from '@nestjs/common';
import { ServiceTypeService } from './service-type.service';
import { ServiceTypeController } from './service-type.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ServiceTypeController],
  providers: [ServiceTypeService],
})
export class ServiceTypeModule {}
