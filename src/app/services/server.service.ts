import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject, map,
  Observable,
  tap
} from 'rxjs';
import { CustomResponse } from '../models/custom-response.interface';
import { Server } from '../models/server.interface';

const LIMIT = 10;

@Injectable({
  providedIn: 'root',
})
export class ServerService {
  private readonly baseUrl: string = 'http://localhost:8080';

  private serversSubject = new BehaviorSubject<Server[]>([]);
  servers$: Observable<Server[]> = this.serversSubject.asObservable();

  constructor(private readonly http: HttpClient) {
    this.loadServers();
  }

  public loadServers(): void {
    this.http
      .get<CustomResponse>(this.baseUrl + `/api/servers?limit=${LIMIT}`)
      .pipe(
        map((response) => response.data.servers ?? []),
        tap((servers) => this.serversSubject.next(servers))
      )
      .subscribe();
  }

  deleteServer(id: number): Observable<Boolean> {
    return this.http
      .delete<CustomResponse>(this.baseUrl + `/api/servers/${id}`)
      .pipe(
        map((response) => response.data.deleted ?? false),
        tap({
          next: (deleted) => {
            if (deleted) {
              const servers = this.serversSubject.value;
              const updatedServers = servers?.filter(
                (server) => server.id !== id
              );
              this.serversSubject.next(updatedServers);
            }
          },
        })
      );
  }

  pingServer(ipAddress: string): Observable<Server | null> {
    return this.http
      .get<CustomResponse>(this.baseUrl + `/api/servers/ping/${ipAddress}`)
      .pipe(
        map((response) => response.data.server ?? null),
        tap({
          next: (pingedServer) => {
            if (pingedServer) {
              let servers = this.serversSubject.value;
              let updatedServers = servers.map((server) => {
                if (server.id === pingedServer.id) {
                  return pingedServer;
                }
                return server;
              });
              this.serversSubject.next(updatedServers);
            }
          },
        })
      );
  }

  createServer(server: Server): Observable<Server | null> {
    
    return this.http
      .post<CustomResponse>(this.baseUrl + `/api/servers`, {})
      .pipe(
        map((response) => response.data.server ?? null),
        tap((serv) => {
          if (serv) {
            const servers = this.serversSubject.value;
            servers?.push(serv);
            this.serversSubject.next(servers);
          }
        })
      );
  }

  updateServer(server: Server): Observable<Server | null> {
    return this.http
      .put<CustomResponse>(this.baseUrl + `/api/servers/${server.id}`, server)
      .pipe(
        map((response) => response.data.server ?? null),
        tap((updateServer) => {
          if (updateServer) {
            let servers = this.serversSubject.value;

            let updatedServers = servers.map((server) => {
              if (server.id === updateServer.id) {
                return updateServer;
              }
              return server;
            });

            this.serversSubject.next(updatedServers);
          }
        })
      );
  }
}
