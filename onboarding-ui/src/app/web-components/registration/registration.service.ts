import { Injectable } from '@angular/core';
import { Validators, FormGroup, FormBuilder, ValidatorFn, ValidationErrors } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { FieldConfig } from 'dynamic-form';
import { DefaultService, ProfileInfo } from 'onboarding-api';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { customMessages, label } from 'src/app/common/utils/constants';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private stubDataJson = {} as any;
  constructor(private translateService: TranslateService, private formBuilder: FormBuilder, private httpclient: HttpClient, private onBoardingService: DefaultService) { }

  initializeRegistration(): Observable<any> {
    const returnObject = { profiles: [], singleProfileData: [] };
    return this.httpclient.get('assets/json/profilesData.json').pipe(
      map((resp: any) => {
        if (resp && resp.isStub) {
          this.stubDataJson = resp;
        }
        return resp.isStub;
      }),
      switchMap((isStub) => {
        if (isStub) {
          const stubProfiles = this.getStubProfiles();
          return of(stubProfiles);
        } else {
          return this.onBoardingService.getprofiles();
        }
      }),
      switchMap((profiles: any) => {
        if (profiles && profiles.length) {
          returnObject.profiles = profiles;
          if (profiles.length === 1) {
            return this.getProfileInfo(profiles[0].profileName);
          } else {
            return of([]);
          }
        } else {
          return of([]);
        }
      }),
      map(resp => {
        returnObject.singleProfileData = resp;
        return returnObject;
      })
    );
  }

  getProfileInfo(profileName: string): Observable<Array<ProfileInfo>> {
    const params: HttpParams = new HttpParams();
    params.set('profileName', profileName);
    if (this.stubDataJson && this.stubDataJson.isStub) {
      const arrayObj = this.stubDataJson.profiles.filter(item => item.profileName === profileName);
      return of(arrayObj);
    } else {
      return this.onBoardingService.getprofileinfos(profileName);
    }

  }

  saveRegistration(partnerRequest: any): Observable<any> {
    return this.onBoardingService.createpartnerInfoEntity(partnerRequest);
  }

  getStubProfiles() {
    let array = [];
    if (this.stubDataJson && this.stubDataJson.profiles && this.stubDataJson.profiles.length) {
      array = this.stubDataJson.profiles.map(item => {
        return { profileName: item.profileName };
      });
    }
    return array;
  }

  mapFormGroupToCreatePartnerRequest(groupData, defIdsMap) {
    const definitionArray: Array<{ dfnId: number, dfnName: string, dfnVal: string }> = [];
    // tslint:disable-next-line: forin
    for (const key in groupData) {
      let defValString = '';
      const isArrayValue = Array.isArray(groupData[key]);
      isArrayValue ? defValString = groupData[key].join(', ') : defValString = groupData[key];
      definitionArray.push({ dfnId: defIdsMap[key], dfnName: key, dfnVal: defValString });
    }
    return definitionArray;
  }
  getGroupsFormControls(kpiGroup) {
    if (kpiGroup && kpiGroup.length) {
      const definitionGroup = this.formBuilder.group({});
      kpiGroup.forEach(definition => {
        if (definition.action && definition.action.indexOf('publish') > -1) {
          const validatorsArray: Array<any> = this.bindValidations(definition);
          const ctrl = this.formBuilder.control('', validatorsArray);
          definitionGroup.addControl(definition.dfnName, ctrl);
        }
      });
      definitionGroup.setValidators(this.confirmEmailValidator());
      return definitionGroup;
    }
  }

  confirmEmailValidator(): ValidatorFn {
    const emailLabel = label.EMAIL;
    const confirmEmailLabel = label.CONFIRMEMAIL;
    return (group: FormGroup): ValidationErrors => {
      const email = group.controls[emailLabel];
      const confirmEmail = group.controls[confirmEmailLabel];
      if (email && confirmEmail) {
        if (email.value.toLowerCase() !== confirmEmail.value.toLowerCase()) {
          confirmEmail.setErrors({ notEquivalent: customMessages.emailConfirmEmailMatch });
        } else {
          confirmEmail.setErrors({ notEquivalent: null });
          if (confirmEmail && confirmEmail.value.length === 0) {
            confirmEmail.setErrors({required: true});
          } else {
              confirmEmail.setErrors(null);
            }//setValidators([Validators.required]);
        }
      }
      return;
    };
  }

  bindValidations(definition) {
    const validatorsArray = [];
    if (definition.validations && definition.validations.length) {
      definition.validations.forEach(validationItem => {
        const item = this.getValidator(validationItem);
        validatorsArray.push(item);
      });
    }
    return validatorsArray;
  }

  getDefinitionsIds(kpiGroup) {
    if (kpiGroup && kpiGroup.length) {
      const defIdsMap = {};
      kpiGroup.forEach(definition => {
        if (definition.action && definition.action.indexOf('publish') > -1) {
          if (!defIdsMap[definition.dfnName]) {
            defIdsMap[definition.dfnName] = definition.dfnId;
          }
        }
      });
      return defIdsMap;
    }
  }

  getGroupsFormConfig(kpiGroup) {
    if (kpiGroup && kpiGroup.length) {
      const grpConfigArray = [];
      kpiGroup.sort((a, b) => {
        return a.dfnOrder - b.dfnOrder;
      });
      kpiGroup.forEach(definition => {
        if (definition.action && definition.action.indexOf('publish') > -1) {
          const configObjOld: any = this.mapConfigDataOld(definition);
          grpConfigArray.push(configObjOld);
        }
      });
      return grpConfigArray;
    }
  }

  mapConfigDataOld(definition) {
    const configObj: FieldConfig = {} as any;
    configObj.type = (definition.fieldType).toString().toLowerCase() === 'grid' ? 'select' : (((definition.fieldType).toString().toLowerCase() === 'plan-element') ? 'plan' : (definition.fieldType).toString().toLowerCase());
    configObj.name = definition.dfnName;
    configObj.label = definition.dfnName;
    configObj.value = '';

    // tslint:disable-next-line: max-line-length
    if (((definition.fieldType).toString().toLowerCase() === 'multiselect' || (definition.fieldType).toString().toLowerCase() === 'radiobutton' || (definition.fieldType).toString().toLowerCase() === 'select') && definition.fieldOptions && definition.fieldOptions !== '') {
      configObj.options = definition.fieldOptions.toString().split(',');
    } else if ((definition.fieldType).toString().toLowerCase() === 'grid' && definition.weightages && definition.weightages.length) {
      configObj.options = definition.weightages.map(weight => weight.type);
    } else if ((definition.fieldType).toString().toLowerCase() === 'plan-element' && definition.weightages && definition.weightages.length) {
      configObj.options = definition.weightages.map(weight => weight.type);
    }

    configObj.validations = [];
    configObj.validations = this.mapValidations(definition.validations);

    return configObj;
  }

  mapValidations(validationsArray: Array<any>) {
    const mappedArray = [];
    if (validationsArray && validationsArray.length) {
      validationsArray.forEach(item => {
        const Obj: { name: string, message: string, validator: Validators } = {
          name: item.validationName,
          message: item.validationMsg,
          validator: this.getValidator(item)
        };
        mappedArray.push({ name: item.validationName, message: item.validationMsg, validator: this.getValidator(item) });
      });
    }
    return mappedArray;
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  }

  getValidator(validationObject): Validators {
    let validation: any;
    switch (validationObject.validationName) {
      case 'required': validation = Validators.required;
                       break;
      case 'min': validation = Validators.min(validationObject.value);
                  break;
      case 'max': validation = Validators.max(validationObject.value);
                  break;
      case 'minlength': validation = Validators.minLength(validationObject.value);
                        break;
      case 'maxlength': validation = Validators.maxLength(validationObject.value);
                        break;
      case 'email': validation = Validators.email;
                    break;
      case 'pattern': validation = Validators.pattern(validationObject.value);
                      break;
    }
    return validation;
  }

}
