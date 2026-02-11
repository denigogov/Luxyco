// src/common/filters/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const isDev = process.env.NODE_ENV !== 'production';

    // Always log server-side (full stack stays in terminal, not in response)
    if (exception instanceof Error) {
      this.logger.error(
        `${request.method} ${request.url} -> ${exception.name}: ${exception.message}`,
        exception.stack,
      );
    } else {
      this.logger.error(
        `${request.method} ${request.url} -> Non-Error thrown: ${String(exception)}`,
      );
    }

    // Base response
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorResponse: Record<string, any> = {
      message: 'Internal server error',
    };

    // 1) HttpException (your validation / business exceptions)
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      errorResponse =
        typeof res === 'string'
          ? { message: res }
          : (res as Record<string, any>);

      return response.status(status).json({
        statusCode: status,
        path: request.url,
        timestamp: new Date().toISOString(),
        error: errorResponse,
      });
    }

    // 2) Prisma known request errors (P2xxx)
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const prismaError = exception;

      // Default for prisma known errors
      status = HttpStatus.BAD_REQUEST;
      errorResponse = { message: 'Database error', code: prismaError.code };

      if (prismaError.code === 'P2002') {
        // Unique constraint failed
        status = HttpStatus.CONFLICT;

        const target = prismaError.meta?.target;
        const field = Array.isArray(target)
          ? target.join(', ')
          : ((target as string) ?? 'field');

        errorResponse = {
          message: 'Unique constraint failed',
          code: prismaError.code,
          field,
        };
      }

      return response.status(status).json({
        statusCode: status,
        path: request.url,
        timestamp: new Date().toISOString(),
        error: errorResponse,
      });
    }

    // 3) Unknown errors: return minimal meta ONLY in dev
    if (isDev && exception instanceof Error) {
      errorResponse = {
        message: exception.message,
        type: exception.name,
        where: exception.stack?.split('\n')[1]?.trim(), // one line only
      };
    }

    return response.status(status).json({
      statusCode: status,
      path: request.url,
      timestamp: new Date().toISOString(),
      error: errorResponse,
    });
  }
}
