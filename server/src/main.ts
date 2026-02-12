// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppValidationPipe } from './common/pipes/app-validation.pipe';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //  app.set('trust proxy', 1); // VERY IMPORTANT for Render

  app.setGlobalPrefix('api'); // global prefix

  app.useGlobalPipes(new AppValidationPipe()); // global validation

  app.useGlobalFilters(new HttpExceptionFilter()); // global error

  app.use(cookieParser());

  app.enableCors({
    origin: true,
    credentials: true,
  });

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
