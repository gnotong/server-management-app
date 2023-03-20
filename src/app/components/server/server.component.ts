import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { filter, Observable, of, switchMap } from 'rxjs';
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
export class ServerComponent implements OnInit {
  servers$!: Observable<Server[]>;

  constructor(
    private readonly service: ServerService,
    private readonly dialog: MatDialog,
    private readonly toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.service.servers$.subscribe({
      next: (servers) => {
        this.servers$ = of(servers);
      },
      error: (error: AppError) => {
        console.log(error.originalError);
      },
    });
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
          return this.service.deleteServer(server.id);
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
      });
  }

  upsertServer(eventArgs: ServerActionEventArgs) {
    if (eventArgs.action.toLowerCase() === 'delete') {
      return;
    }

    const create = eventArgs.action.toLowerCase() === 'create';
    const server = eventArgs.server;

    this.dialog
      .open(ServerDialogComponent, {
        data: { title: create ? 'Add server' : 'Edit Server', server: server },
      })
      .afterClosed()
      .pipe(
        filter((data: Server) => data !== undefined),
        switchMap((serverData: Server) => {
          return create
            ? this.service.createServer(serverData)
            : this.service.updateServer(serverData);
        })
      )
      .subscribe({
        next: (serverResponse) => {
          if (serverResponse) {
            const actionMessage = create ? 'created' : 'updated';
            this.toastrService.success(
              `Server <${serverResponse.ipAddress}> ${actionMessage}`,
              'SUCCESS'
            );
          }
        },
        error: (error) => {
          if (error instanceof AppError) {
            this.toastrService.error(error.originalError, 'ERROR');
            return;
          }
          throw error;
        },
      });
  }
}
