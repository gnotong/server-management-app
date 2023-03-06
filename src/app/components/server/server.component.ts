import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Status } from 'src/app/enums/status.enum';
import { AppError } from 'src/app/errors/app.error';
import { CustomResponse } from 'src/app/models/custom-response.interface';
import { Server } from 'src/app/models/server.interface';
import { ServerService } from 'src/app/services/server.service';
import { CreateServerDialogComponent } from '../dialogs/create-server-dialog/create-server-dialog.component';

@Component({
  selector: 'app-server',
  templateUrl: './server.component.html',
  styleUrls: ['./server.component.css'],
})
export class ServerComponent implements OnInit {
  servers: Server[] = [];
  server: Server | undefined;

  constructor(
    private readonly service: ServerService,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.service.getServers().subscribe({
      next: (response: CustomResponse) => {
        this.servers = response.data?.servers ?? [];
      },
      error: (error: AppError) => {
        console.log(error.originalError);
      },
    });
  }

  showServer(serverId: number) {
    this.server = this.servers?.find((s) => s.id === serverId);
  }

  createNewServer(data: Server) {
    this.service.createServer(data).subscribe({
      next: (response: CustomResponse) => {
        const data = response.data;
        if (data?.server) {
          this.servers.push(data.server);
          // todo: popup to show that everything is ok
        }
      },
      error: (error: AppError) => {
        // todo: popup to show that everything is !ok
        // make sure to refill the server form with the data when the add button is clicked once again
        console.log(error.originalError);
      }
    });
  }

  getServer(serverId: number) {
    return this.service.getServer(serverId).subscribe({
      next: (response: CustomResponse) => {
        this.server = response.data?.server;
      },
      error: (error: AppError) => {
        console.log(error.originalError);
      },
    });
  }

  deleteServer(server: Server) {
    let index = this.servers.findIndex((s) => s.id === server.id);
    this.servers.splice(index, 1);
    return this.service.deleteServer(server.id).subscribe({
      next: (response: CustomResponse) => {
        alert('Server deleted');
      },
      error: (error: AppError) => {
        this.servers.splice(index, 0, server);
        console.log(error.originalError);
      },
    });
  }

  openNewServerForm() {
    this.dialog.open(CreateServerDialogComponent, {
      width: '500px',
      data: { title: 'New Server'},
    }).afterClosed().subscribe((data: Server) => {
      data.status = Status.SERVER_DOWN;
      this.createNewServer(data);
    })
  }
}
