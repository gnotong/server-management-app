import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, tap } from 'rxjs';
import { AppError } from 'src/app/errors/app.error';
import { Server } from 'src/app/models/server.interface';
import { ServerService } from 'src/app/services/server.service';
import { ConfirmationDialogComponent } from '../dialogs/confirmation-dialog/confirmation-dialog.component';
import { ServerDialogComponent } from '../dialogs/server-dialog/server-dialog.component';

@Component({
  selector: 'app-server',
  templateUrl: './server.component.html',
  styleUrls: ['./server.component.css'],
})
export class ServerComponent implements OnInit {
  servers$!: Observable<Server[] | undefined>;

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

  deleteServer(server: Server) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Delete Server',
        message: `Are you sure you want to delete this server: ${server.name} ?`,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) {
        return;
      }

      this.service.deleteServer(server.id).subscribe({
        next: (deleted) => {
          if (deleted) {
            this.toastrService.success(
              `Server <${server.name}> deleted`,
              'SUCCESS'
            );
          }
        },
      });
    });
  }

  openServerForm(server?: Server) {
    this.dialog
      .open(ServerDialogComponent, {
        width: '500px',
        data: { title: server ? 'Edit Server' : 'Add server', server: server },
      })
      .afterClosed()
      .subscribe((data: Server) => {
        if (data === undefined) {
          return;
        }

        this.createUpdateServer(data);
      });
  }

  createUpdateServer(server: Server) {
    const create = server.id == undefined;
    const request = create
      ? this.service.createServer(server)
      : this.service.updateServer(server);

    request.subscribe({
      next: (server) => {
        if (server) {
          const actionMessage = create ? 'created' : 'updated';
          this.toastrService.success(
            `Server <${server.ipAddress}> ${actionMessage}`,
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
