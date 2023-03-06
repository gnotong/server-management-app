import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Status } from 'src/app/enums/status.enum';
import { Server } from 'src/app/models/server.interface';
import { StatusForm } from 'src/app/models/status-form.interface';
import { ServerService } from 'src/app/services/server.service';

@Component({
  selector: 'create-server-form',
  templateUrl: './server-form.component.html',
  styleUrls: ['./server-form.component.css'],
})
export class ServerFormComponent {
  @Output() createServerFormSubmitEvent = new EventEmitter();
  @Output() createServerFormCancelEvent = new EventEmitter();
  form: FormGroup;
  serverFormStatus: StatusForm[] = [
    {'label': 'All', 'value': Status.ALL},
    {'label': 'Server up', 'value': Status.SERVER_UP},
    {'label': 'Server down', 'value': Status.SERVER_DOWN},
  ];

  constructor(
    private fb: FormBuilder,
    private readonly serverService: ServerService
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      ipAddress: ['', Validators.required],
      type: ['', Validators.required],
      memory: ['', Validators.required]
    });
  }

  cancel() {
    this.createServerFormCancelEvent.emit();
  }

  submit() {
    if(this.form.invalid) {
      this.form.setErrors({invalid: true});
      return;
    }
    this.createServerFormSubmitEvent.emit({data: this.form.value});
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
