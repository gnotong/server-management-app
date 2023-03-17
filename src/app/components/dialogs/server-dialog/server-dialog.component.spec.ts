import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerDialogComponent } from './server-dialog.component';

describe('CreateServerDialogComponent', () => {
  let component: ServerDialogComponent;
  let fixture: ComponentFixture<ServerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServerDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
