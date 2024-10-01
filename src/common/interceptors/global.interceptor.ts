import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { DataResponse, MessageResponse } from "../constants/http/response";

@Injectable()
export class GlobalInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return new DataResponse(HttpStatus.OK, "success", data);
      }),
      catchError((err) => {
        return throwError(
          () =>
            new HttpException(
              new MessageResponse(err.status, err.response),
              err.status
            )
        );
        // }
      })
    );
  }
}
