import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Server } from 'src/app/models/server.interface';
import { ServerService } from 'src/app/services/server.service';

@Component({
  selector: 'server-list',
  templateUrl: './server-list.component.html',
  styleUrls: ['./server-list.component.css']
})
export class ServerListComponent implements OnInit {
  @Output('createServerEvent') createServerEvent = new EventEmitter();
  @Output('updateServerEvent') updateServerEvent = new EventEmitter();
  @Output('deleteServerEvent') deleteServerEvent = new EventEmitter();
  @Output('pingServerEvent') pingServerEvent = new EventEmitter();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['name', 'ipAddress', 'type', 'memory', 'status', 'actions'];
  dataSource = new MatTableDataSource<Server>([]);

  constructor(private readonly serverService: ServerService){}

  ngOnInit() {
    this.serverService.servers$.subscribe(servers => {
      this.dataSource.data = servers;
      this.dataSource.paginator = this.paginator;
    });
  }

  applyFilter(event: Event) {
    const filteredValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filteredValue.trim().toLowerCase();
  }

  create() {
    this.createServerEvent.emit({action: 'create', server: undefined});
  }

  update(server: Server) {
    this.updateServerEvent.emit({action: 'update', server: server});
  }

  delete(server: Server) {
    this.deleteServerEvent.emit({action: 'delete', server: server});
  }

  ping(server: Server) {
    this.pingServerEvent.emit({action: 'ping', server: server});
  }
}

export interface ServerActionEventArgs {
  action: string;
  server: Server;
}
