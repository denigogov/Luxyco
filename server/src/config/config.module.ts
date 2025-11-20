import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './configuration';
import { envValidationSchema } from './env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // ConfigService available everywhere
      load: [configuration], // configuration.ts
      validationSchema: envValidationSchema,
    }),
  ],
})
export class AppConfigModule {}
