import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ServerFormSubmitEventArgs } from '../../forms/server-form/server-form.component';

@Component({
  selector: 'server-dialog',
  templateUrl: './server-dialog.component.html',
  styleUrls: ['./server-dialog.component.css']
})
export class ServerDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<ServerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(event: any): void {
    this.dialogRef.close(event?.data);
  }
}
