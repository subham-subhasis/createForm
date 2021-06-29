import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material';
import { ToastType } from '../toast.type';
import { AlertbarComponent } from '../alertbar.component';
@Injectable({
  providedIn: 'root'
})
export class AlertbarService {
  snackBarRef: any;
  actionButtonLabel = '';
  action = false;
  setAutoHide = true;
  autoHide = 200000000;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  addExtraClass = true;
  constructor(public snackBar: MatSnackBar) {
  }

  show(type: ToastType, title?: string, body?: string, delay?: number) {
    const config = new MatSnackBarConfig();
    config.verticalPosition = this.verticalPosition;
    config.horizontalPosition = this.horizontalPosition;
    config.duration = this.setAutoHide ? delay : 0;
    if (type === 'error') {
      config.panelClass = ['alert-fail'] ;
    } else if (type === 'success') {
      config.panelClass = ['alert-success'] ;
    } else if (type === 'warning') {
      config.panelClass = ['alert-warn'] ;
    } else {
      config.panelClass = ['alert-none'] ;
    }
    this.snackBarRef = this.snackBar.openFromComponent(AlertbarComponent , config);
    this.snackBarRef.instance.snackBarRef = this.snackBarRef;
    this.snackBarRef.instance.miMethod(body, type);
  }

  closeSnackBar() {
    this.snackBarRef.dismiss();
  }
}
