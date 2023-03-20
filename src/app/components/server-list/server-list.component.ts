import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Server } from 'src/app/models/server.interface';

@Component({
  selector: 'server-list',
  templateUrl: './server-list.component.html',
  styleUrls: ['./server-list.component.css']
})
export class ServerListComponent {
  @Input('servers') servers!: Server[]
  @Output('createServerEvent') createServerEvent = new EventEmitter();
  @Output('updateServerEvent') updateServerEvent = new EventEmitter();
  @Output('deleteServerEvent') deleteServerEvent = new EventEmitter();
  @Output('pingServerEvent') pingServerEvent = new EventEmitter();

  displayedColumns: string[] = ['id', 'name', 'ipAddress', 'type', 'memory', 'status', 'actions'];
  dataSource  = new MatTableDataSource<Server>(this.servers);


  applyFilter(event: Event) {
    const filteredValue = (event.target as HTMLInputElement).value;
    console.log(filteredValue);
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
