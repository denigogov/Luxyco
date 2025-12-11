// src/common/interceptors/camel-case-response.interceptor.ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { keysToCamel } from '../utils/camel-case.util';

@Injectable()
export class CamelCaseResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (
          data === null ||
          data === undefined ||
          data instanceof Buffer ||
          data instanceof ReadableStream
        ) {
          return data;
        }

        return keysToCamel(data);
      }),
    );
  }
}
