import { Component, OnInit, ViewEncapsulation, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { PasswordStrengthValidator } from './password-validators';
import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/common/services/common.service';
import { errorMessagesSetPassword, maxLengthSetpw, minLengthSetpw, strongPwLength, customMessages, passwordStrength } from 'src/app/common/utils/constants';
import { SetPasswordService } from './service/set-password.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SetPasswordComponent implements OnInit, OnChanges, OnDestroy {
  // tslint:disable-next-line: no-input-rename
  @Input('usernamevalue') public usernamevalue: string;
  @Input() userid: number;
  constructor(private translateService: TranslateService,
    public formBuilder: FormBuilder,
    private commonService: CommonService,
    private setPasswordService: SetPasswordService) {
    this.configureFormGroup();
  }

  formData = { message: '', confirmDialog: false };
  loginForm: FormGroup;
  submitForm = false;
  passwordSaved = false;
  strongPw = false;
  hidePw = true;
  hideConfPw = true;
  maxLength = maxLengthSetpw;
  minLength = minLengthSetpw;
  strongPwLength = strongPwLength;
  strengthBar = passwordStrength;
  strengthText = this.strengthBar[1];
  bar0: string;
  bar1: string;
  bar2: string;
  bar3: string;
  colors = ['darkred', 'orangered', 'orange', 'yellowgreen'];
  // tslint:disable-next-line: variable-name
  error_messages = errorMessagesSetPassword;
  showSpinner = false;
  setPasswordSubscription: Subscription;

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.commonService.userId = this.userid;
    this.commonService.userName = this.usernamevalue;
    this.commonService.hideToaster();
    if (changes['usernamevalue']) {
      console.log(this.usernamevalue);
    }
  }

  configureFormGroupReset() {
    this.submitForm = false;
    this.strongPw = false;
    this.hidePw = true;
    this.hideConfPw = true;
    this.configureFormGroup();
  }

  onModalClick(event: any) {
    if (event === 'close') {
      this.formData.confirmDialog = false;
    } else if (event === 'yes') {
      this.formData.confirmDialog = false;
    }
  }

  configureFormGroup() {
    this.loginForm = this.formBuilder.group({
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(this.minLength),
        Validators.maxLength(this.maxLength),
        PasswordStrengthValidator
      ])),
      confirmpassword: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(this.minLength),
        Validators.maxLength(this.maxLength),
        PasswordStrengthValidator
      ])),
    }, {
      validators: this.password()
    });
  }

  getColor(s) {
    let index = 0;
    if (s === 10) {
      index = 0;
    } else if (s === 20) {
      index = 1;
    } else if (s === 30) {
      index = 2;
    } else if (s === 40) {
      index = 3;
    } else {
      index = 4;
    }
    return {
      index: index + 1,
      color: this.colors[index]
    };
  }

  setBarColors(count, col) {
    for (let n = 0; n < count; n++) {
      this['bar' + n] = col;
    }
  }

  checkStrength() {
    const enteredPassword = this.loginForm.value.password;
    this.setBarColors(4, '#DDD');
    let force = 0;
    const regex = /[$-/:-?{-~!"^_@`\[\]]/g;
    const lowerLetters = /[a-z]+/.test(enteredPassword);
    const upperLetters = /[A-Z]+/.test(enteredPassword);
    const numbers = /[0-9]+/.test(enteredPassword);
    const symbols = regex.test(enteredPassword);
    const flags = [upperLetters, lowerLetters, numbers, symbols];
    let passedMatches = 0;
    for (const flag of flags) {
      passedMatches += flag === true ? 1 : 0;
    }
    force += 2 * enteredPassword.length + ((enteredPassword.length >= 10) ? 1 : 0);
    force += passedMatches * 10;
    force = (enteredPassword.length <= 5) ? Math.min(force, 10) : force;
    force = (passedMatches === 1) ? Math.min(force, 10) : force;
    force = (passedMatches === 2) ? Math.min(force, 20) : force;
    force = (passedMatches === 3) ? Math.min(force, 30) : force;
    force = (passedMatches === 4) ? Math.min(force, 40) : force;
    const c = this.getColor(force);
    this.setBarColors(c.index, c.color);
    this.strengthText = this.strengthBar[c.index];
  }

  cancelForm() {
    this.submitForm = false;
    this.strongPw = false;
    this.configureFormGroup();
    this.hidePw = true;
    this.hideConfPw = true;
    this.passwordSaved = false;
    this.checkStrength();
  }

  redirect(param: string) {
    let url = '';
    if (!environment.production) {
      param === 'switch' ? url = 'http://10.113.116.113:8080/partnerportalv3/sparkLogin.jsp' :
        url = 'http://10.113.116.113:8080/partnerportalv3/sparkLogout.html';
    } else {
      const href: string = location.href;
      const path = this.commonService.generateDynamicUrl(href);
      if (param === 'switch') {
        const host = location.host;
        url = 'http://' + host + '/' + path;
      } else if (param === 'logout') {
        const host = location.host;
        url = 'http://' + host + '/' + path + '/sparkLogout.html';
      }
    }
    return url;
  }

  password() {
    let errorMsg = '';
    // tslint:disable-next-line: no-shadowed-variable
    this.translateService.get('NEWPASSWORD.PASSWORDCONFIRMPASSWORDMATCH').subscribe((value) => {
      errorMsg = value;
    });
    return (loginForm: FormGroup): ValidationErrors => {
      const password = loginForm.controls['password'];
      const confirmPassword = loginForm.controls['confirmpassword'];
      if (password && confirmPassword) {
        if (password.value.toLowerCase() !== confirmPassword.value.toLowerCase()) {
          confirmPassword.setErrors({ passwordNotMatch: errorMsg });
        } else {
          confirmPassword.setErrors(null);
        }
      }
      return;
    };
  }

  submitNewPassword() {
    let userNameString = '';
    if (this.usernamevalue && this.usernamevalue.length > 0) {
      userNameString = window.atob(this.usernamevalue).toString();
    } else {
      userNameString = '';
    }
    if (this.loginForm.value.password && this.loginForm.value.password.length > 0 && this.loginForm.value.confirmpassword && this.loginForm.value.confirmpassword.length > 0) {
      this.submitForm = true;
      this.showSpinner = true;
      if (this.loginForm.valid) {
        const newPwd = this.loginForm.get('password').value;
        this.setPasswordSubscription = this.setPasswordService.savePassword(userNameString, newPwd)
          .subscribe(
            data => {
              this.showSpinner = false;
              this.passwordSaved = true;
              this.configureFormGroupReset();
              const url = this.redirect('logout');
              location.assign(url);
            },
            error => {
              this.formData.confirmDialog = true;
              this.showSpinner = false;
              this.passwordSaved = false;
              let message = customMessages.passwordcreationFailed;
              if (error.error && error.error.Status && error.error.Status.length > 0) {
                message = message + error.error.Status;
              }
              this.formData.message = message;
            }
          );
      }
    }
  }

  ngOnDestroy(): void {
    this.commonService.hideToaster();
    this.setPasswordSubscription && this.setPasswordSubscription.unsubscribe();
  }

}
