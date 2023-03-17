import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Status } from 'src/app/enums/status.enum';
import { Server } from 'src/app/models/server.interface';

@Component({
  selector: 'server-form',
  templateUrl: './server-form.component.html',
  styleUrls: ['./server-form.component.css'],
})
export class ServerFormComponent implements OnInit {
  @Output() serverFormSubmitEvent = new EventEmitter();
  @Output() serverFormCancelEvent = new EventEmitter();
  @Input('server') server!: Server;
  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [this.server?.id, {visibility: 'hidden'}],
      name: [this.server?.name, [Validators.required, Validators.minLength(3)]],
      ipAddress: [this.server?.ipAddress, Validators.required],
      type: [this.server?.type, Validators.required],
      memory: [this.server?.memory, Validators.required],
      status: [this.server?.status ?? Status.SERVER_DOWN]
    });
  }

  cancel() {
    this.serverFormCancelEvent.emit();
  }

  submit() {    
    if(this.form.invalid) {
      this.form.setErrors({invalid: true});
      return;
    }
    this.serverFormSubmitEvent.emit({data: this.form.value});
  }

  get name() {
    return this.form.get('name');
  }

  get ipAddress() {
    return this.form.get('ipAddress');
  }

  get type() {
    return this.form.get('type');
  }

  get memory() {
    return this.form.get('memory');
  }

  get status() {
    return this.form.get('status');
  }
}

export interface ServerFormSubmitEventArgs {
  data: Server
}
