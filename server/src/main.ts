// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppValidationPipe } from './common/pipes/app-validation.pipe';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api'); // global prefix

  app.useGlobalPipes(new AppValidationPipe()); // global validation

  app.useGlobalFilters(new HttpExceptionFilter()); // global error

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
