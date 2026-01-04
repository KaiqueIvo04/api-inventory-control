import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class TotalCountInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((result) => {
        // Espera [data, total]
        if (
          Array.isArray(result) &&
          result.length === 2 &&
          Array.isArray(result[0]) &&
          typeof result[1] === 'number'
        ) {
          const [data, total] = result;

          response.setHeader('X-Total-Count', total.toString());
          response.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');

          return data; // body apenas com array
        }

        return result;
      }),
    );
  }
}
