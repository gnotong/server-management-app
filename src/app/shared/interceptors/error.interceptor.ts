import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { NotFoundError } from 'src/app/errors/not-found.error';
import { BadRequestError } from 'src/app/errors/bad-request.error';
import { AppError } from 'src/app/errors/app.error';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(catchError(this.handleError));
  }

  private handleError(response: HttpErrorResponse) {
    const errorData = response.error?.data;

    if (response.status == 404) {
      return throwError(() => new NotFoundError(errorData.error));
    }

    if (response.status == 400) {
      const error = Object.values(errorData.error);
      return throwError(() => new BadRequestError(error.join(', ')));
    }

    return throwError(() => new AppError(errorData.error));
  }
}
