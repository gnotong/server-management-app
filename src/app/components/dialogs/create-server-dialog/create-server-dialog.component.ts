import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ServerFormSubmitEventArgs } from '../../forms/server-form/server-form.component';

@Component({
  selector: 'create-server-dialog',
  templateUrl: './create-server-dialog.component.html',
  styleUrls: ['./create-server-dialog.component.css']
})
export class CreateServerDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<CreateServerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(event: ServerFormSubmitEventArgs): void {
    this.dialogRef.close(event.data);
  }
}
