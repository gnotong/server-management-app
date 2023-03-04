import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { AppError } from '../errors/app.error';
import { NotFoundError } from '../errors/not-found.error';
import { CustomResponse } from '../models/custom-response.interface';
import { Server } from '../models/server.interface';

const LIMIT = 10;

@Injectable({
  providedIn: 'root',
})
export class ServerService {
  private readonly baseUrl: string = 'http://localhost:8080';

  constructor(private readonly http: HttpClient) {}

  getServers(): Observable<CustomResponse> {
    return this.http
      .get<CustomResponse>(this.baseUrl + `/api/servers?limit=${LIMIT}`)
      .pipe(catchError(this.handleError));
  }

  getServer(id: number): Observable<CustomResponse> {
    return this.http
      .get<CustomResponse>(this.baseUrl + `/api/servers/${id}`)
      .pipe(catchError(this.handleError));
  }
 
  deleteServer(id: number): Observable<CustomResponse> {
    return this.http
    .delete<CustomResponse>(this.baseUrl + `/api/servers/${id}`)
    .pipe(catchError(this.handleError));
  }

  createServer(server?: Server): Observable<CustomResponse> {
    return this.http
      .post<CustomResponse>(this.baseUrl + `/api/servers`, server)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: Response) {
    if (error.status == 404) {
      return throwError(() => new NotFoundError('Servers list not found'));
    }

    return throwError(() => new AppError(error));
  }
}
