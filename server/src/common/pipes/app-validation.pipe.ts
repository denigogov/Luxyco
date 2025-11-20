import {
  BadRequestException,
  ValidationPipe as NestValidationPipe,
} from '@nestjs/common';

export class AppValidationPipe extends NestValidationPipe {
  constructor() {
    super({
      whitelist: true, // strip unknown properties
      forbidNonWhitelisted: true, // throw if unknown props are sent
      transform: true, // auto-transform payloads to DTO classes
      transformOptions: {
        enableImplicitConversion: false, //on true= auto convert number to string (example 2 = "2" or "   "  is also string)
      },
      forbidUnknownValues: true,
      exceptionFactory: (errors) => {
        // shape validation errors for frontend
        const formattedErrors = errors.map((error) => ({
          field: error.property,
          constraints: error.constraints,
        }));

        return new BadRequestException({
          message: 'Validation failed',
          errors: formattedErrors,
        });
      },
    });
  }
}
