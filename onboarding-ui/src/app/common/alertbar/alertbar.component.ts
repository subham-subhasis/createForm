import { Component, OnInit } from '@angular/core';
import { MatSnackBarRef } from '@angular/material';
import { ToastType } from './toast.type';
@Component({
  selector: 'app-alertbar',
  templateUrl: './alertbar.component.html',
  styleUrls: ['./alertbar.component.scss']
})
export class AlertbarComponent implements OnInit {

  public message: string;
  public action: string;
  public statusObj = { error : false, success: false, warn: false, none: false  }
  snackBarRef: MatSnackBarRef<AlertbarComponent>;

  get hasAction(): boolean { return !!this.action; }

  constructor() {}

  ngOnInit(): void {
  }

  miMethod(body: string, type: ToastType): void {
    this.message = body;
    this.action = '';
    if (type === 'error') {
      this.statusObj.error = true;
      this.statusObj.success = false;
      this.statusObj.warn = false;
      this.statusObj.none = false;
    } else if (type === 'success') {
      this.statusObj.error = false;
      this.statusObj.success = true;
      this.statusObj.warn = false;
      this.statusObj.none = false;
    } else if (type === 'warning') {
      this.statusObj.error = false;
      this.statusObj.success = false;
      this.statusObj.warn = true;
      this.statusObj.none = false;
    } else {
      this.snackBarRef.dismiss();
      this.statusObj.error = false;
      this.statusObj.success = false;
      this.statusObj.warn = false;
      this.statusObj.none = true;
    }
  }

  dismiss(): void {
    this.snackBarRef.dismiss();
  }

}
