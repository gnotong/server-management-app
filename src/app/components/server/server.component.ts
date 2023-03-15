import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, tap } from 'rxjs';
import { AppError } from 'src/app/errors/app.error';
import { Server } from 'src/app/models/server.interface';
import { ServerService } from 'src/app/services/server.service';
import { ConfirmationDialogComponent } from '../dialogs/confirmation-dialog/confirmation-dialog.component';
import { CreateServerDialogComponent } from '../dialogs/create-server-dialog/create-server-dialog.component';

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

      this.service
        .deleteServer(server.id)
        .pipe(
          tap((deleted) => {
            if (deleted) {
              this.toastrService.success(
                `Server <${server.name}> deleted`,
                'SUCCESS'
              );
            }
          })
        )
        .subscribe();
    });
  }

  openNewServerForm() {
    this.dialog
      .open(CreateServerDialogComponent, {
        width: '500px',
        data: { title: 'New Server' },
      })
      .afterClosed()
      .subscribe((data: Server) => {
        if (data === undefined) {
          return;
        }

        this.createNewServer(data);
      });
  }

  createNewServer(server: Server) {
    this.service.createServer(server).subscribe({
      next: (server) => {
        if (server) {
          this.toastrService.success('Server created', 'SUCCESS');
        }
      },
      error: (error: AppError) => {
        this.toastrService.error(error.originalError, 'ERROR');
      },
    });
  }
}
