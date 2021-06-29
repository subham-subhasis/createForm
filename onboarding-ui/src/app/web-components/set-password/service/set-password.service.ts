import { Injectable } from '@angular/core';
import { DefaultService } from 'onboarding-api';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SetPasswordService {

  changePwdUrl = '';
  constructor(private onBoardingService: DefaultService) {
  }

  savePassword(userName: string, password: string ) {
    let newPasswordEncrypt = '';
    newPasswordEncrypt = window.btoa(password);
    const obj = {userName, password: newPasswordEncrypt};
    return this.onBoardingService.savePassword(obj);
  }

  handleError(error: HttpErrorResponse): any {
    return throwError(error);
  }
}
