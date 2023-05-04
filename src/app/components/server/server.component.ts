import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { filter, switchMap } from 'rxjs';
import { AppError } from 'src/app/errors/app.error';
import { Server } from 'src/app/models/server.interface';
import { ServerService } from 'src/app/services/server.service';
import { ConfirmationDialogComponent } from '../dialogs/confirmation-dialog/confirmation-dialog.component';
import { ServerDialogComponent } from '../dialogs/server-dialog/server-dialog.component';
import { ServerActionEventArgs } from '../server-list/server-list.component';

@Component({
  selector: 'app-server',
  templateUrl: './server.component.html',
  styleUrls: ['./server.component.css'],
})
export class ServerComponent {

  constructor(
    private readonly serverService: ServerService,
    private readonly dialog: MatDialog,
    private readonly toastrService: ToastrService
  ) {}

  generated: boolean = false;
  changeBackgroundColor: boolean = false;
  @ViewChild('rand') rand! : ElementRef

  changeBg(): void {
    this.changeBackgroundColor = true;
  } 
  generate(): void {
    this.generated = true;    
  }

  deleteServer(eventArgs: ServerActionEventArgs) {
    if (eventArgs.action.toLowerCase() !== 'delete') {
      return;
    }

    const server = eventArgs.server;

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Delete Server',
        message: `Are you sure you want to delete this server: ${server.name} ?`,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((confirmed) => !!confirmed),
        switchMap(() => {
          return this.serverService.deleteServer(server.id);
        })
      )
      .subscribe({
        next: (deleted) => {
          if (deleted) {
            this.toastrService.success(
              `Server <${server.name}> deleted`,
              'SUCCESS'
            );
          }
        },
        error: (error) => this.handleError(error),
      });
  }

  upsertServer(server: Server | null) {

    this.dialog
      .open(ServerDialogComponent, {
        data: { title: !server ? 'Add server' : 'Edit Server', server: server },
      })
      .afterClosed()
      .pipe(
        filter((data: Server) => data !== undefined),
        switchMap((serverData: Server) => {
          return !server
            ? this.serverService.createServer(serverData)
            : this.serverService.updateServer(serverData);
        })
      )
      .subscribe({
        next: (serverResponse) => {
          if (serverResponse) {
            const actionMessage = !server ? 'created' : 'updated';
            this.toastrService.success(
              `Server <${serverResponse.ipAddress}> ${actionMessage}`,
              'SUCCESS'
            );
          }
        },
        error: (error) => this.handleError(error),
      });
  }

  pingServer(eventArgs: ServerActionEventArgs) {
    if (eventArgs.action.toLowerCase() !== 'ping') {
      return;
    }

    const server = eventArgs.server;

    this.serverService.pingServer(server.ipAddress).subscribe({
      next: (serverResponse) => {
        if (serverResponse) {
          this.toastrService.success(
            `Ping ${serverResponse.ipAddress}: OK`,
            'SUCCESS'
          );
        }
      },
      error: (error) => this.handleError(error),
    });
  }

  handleError(error: any) {
    if (error instanceof AppError) {
      this.toastrService.error(error.originalError, 'ERROR');
      return;
    }

    throw error;
  }
}
