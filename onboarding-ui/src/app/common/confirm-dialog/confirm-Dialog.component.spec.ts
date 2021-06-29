import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDialogElementComponent } from './confirm-Dialog.component';

describe('ConfirmDialogElementComponent', () => {
  let component: ConfirmDialogElementComponent;
  let fixture: ComponentFixture<ConfirmDialogElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmDialogElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDialogElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
