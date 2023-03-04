import { Component, OnInit } from '@angular/core';
import { AppError } from 'src/app/errors/app.error';
import { Server } from 'src/app/models/server.interface';
import { ServerService } from 'src/app/services/server.service';

@Component({
  selector: 'app-server',
  templateUrl: './server.component.html',
  styleUrls: ['./server.component.css'],
})
export class ServerComponent implements OnInit {
  servers: Server[] = [];  
  server: Server | undefined;

  constructor(private readonly service: ServerService) {}

  ngOnInit(): void {
    this.service.getServers().subscribe({
      next: (servers) => {this.servers = servers.data.servers ?? []; },
      error: (error: AppError) => {
        console.log(error.originalError);
      },
    });
  }

  showServer(serverId: number) {
    this.server = this.servers?.find(s => s.id === serverId);
  }

  addServer() {
    this.service.createServer().subscribe({ 
      next: (server) => {
        this.server = server?.data.server;

      },
      error: (error: AppError) => {
        console.log(error.originalError);
      },
    });
  }

  getServer(serverId: number) {
    return this.service.getServer(serverId).subscribe({
      next: (server) => {this.server = server.data?.server},
      error: (error: AppError) => {
        console.log(error.originalError);
      },
    });
  }
}
