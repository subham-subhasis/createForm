import { Injectable } from '@angular/core';
import { DataService } from 'src/app/common/services/data.service.ts';
import { API, customMessages } from 'src/app/common/utils/constants';
import { DefaultService, FieldGroupEntry } from 'onboarding-api';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { Validators } from '@angular/forms';
import { CommonService } from 'src/app/common/services/common.service';
import { Validation } from '../configuration.component';
import { ApiConfigService } from 'src/app/config.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigureService {

  editKPIDetails = {fieldGroup: {}, kpi: {}, grpDefinitions: [], weightagesBackUp: [], indexOfKPI: 0};

  constructor(private dataService: DataService, private onBoardingService: DefaultService, private commonService: CommonService) { }

  setEditKPIDeatails(fieldGroup: any, kpi: any, grpDefinitions: any, indexOfDefn: any) {
    let weightagesBackUpValue = [];
    this.editKPIDetails = {fieldGroup: {}, kpi: {}, grpDefinitions: [], weightagesBackUp: [], indexOfKPI: 0};
    if (kpi && kpi.weightages && kpi.weightages.length > 0) {
      weightagesBackUpValue = [...kpi.weightages];
    }
    this.editKPIDetails.fieldGroup = Object.assign({}, fieldGroup);
    this.editKPIDetails.kpi = Object.assign({}, kpi);
    this.editKPIDetails.grpDefinitions = [...grpDefinitions];
    this.editKPIDetails.weightagesBackUp = weightagesBackUpValue;
    this.editKPIDetails.indexOfKPI = indexOfDefn;
  }

  fetchEditKPIDeatails(): any {
    return this.editKPIDetails;
  }

  bindPageloadJsonData(configureData: any, jsonData: any): any {
    jsonData.userDefinedTypes = configureData.userDefinedType;
    jsonData.userDefinedValiations = configureData.userDefinedTypeValidation;
    jsonData.userDefinedValiationsWithFilter = configureData.userDefinedTypeValidation;
    jsonData.teams = configureData.teamDetails;
    jsonData.actions = configureData.actionTypes;
    jsonData.basicDetailsGroupData = configureData.basicDetailsGroupData;
    jsonData.businessTypes = configureData.businessTypes;
    jsonData.kpiDefinationsPreDefined = configureData.kpiDefinationsPreDefined;
    return jsonData;
  }

  resetValidationFlagsUD(validationMessageView: any): any {
    return validationMessageView = { minValueFlag: false, maxValueFlag: false, errMandateFlag: false, errMinValueFlag: false, errMaxValueFlag: false, errMinLengthFlag: false, errMaxLengthFlag: false, errEmailFlag: false, ipPatternFlag: false, errPatternFlag: false };
  }

  resetValidationMessage(userDefinedform: any, jsonDataValidationMsg: any): any {
    userDefinedform.controls.manadtoryMessage.setValue(this.commonService.getUniqueObjectFromArr(jsonDataValidationMsg, 'value', 'required').defaultMessage);
    userDefinedform.controls.ipMinimumLength.setValue( this.commonService.getUniqueObjectFromArr(jsonDataValidationMsg, 'value', 'min').defaultlength);
    userDefinedform.controls.minimumLengthNumberErrorMessage.setValue( this.commonService.getUniqueObjectFromArr(jsonDataValidationMsg, 'value', 'min').defaultMessage),
    userDefinedform.controls.ipMaximumLength.setValue( this.commonService.getUniqueObjectFromArr(jsonDataValidationMsg, 'value', 'max').defaultlength);
    userDefinedform.controls.maximumLengthNumberErrorMessage.setValue( this.commonService.getUniqueObjectFromArr(jsonDataValidationMsg, 'value', 'max').defaultMessage);
    userDefinedform.controls.minimumLengthStringErrorMessage.setValue( this.commonService.getUniqueObjectFromArr(jsonDataValidationMsg, 'value', 'minlength').defaultMessage);
    userDefinedform.controls.ipMinimumLength.setValue( this.commonService.getUniqueObjectFromArr(jsonDataValidationMsg, 'value', 'minlength').defaultlength);
    userDefinedform.controls.maximumLengthStringErrorMessage.setValue( this.commonService.getUniqueObjectFromArr(jsonDataValidationMsg, 'value', 'maxlength').defaultMessage);
    userDefinedform.controls.ipMaximumLength.setValue( this.commonService.getUniqueObjectFromArr(jsonDataValidationMsg, 'value', 'maxlength').defaultlength);
    userDefinedform.controls.emailErrorMessage.setValue( this.commonService.getUniqueObjectFromArr(jsonDataValidationMsg, 'value', 'email').defaultMessage);
    userDefinedform.controls.ipPattern.setValue('Enter Pattern.');
    userDefinedform.controls.patternErrorMessage.setValue( this.commonService.getUniqueObjectFromArr(jsonDataValidationMsg, 'value', 'pattern').defaultMessage);
    return userDefinedform;
  }

  validationFieldsUD(userDefinedValidation: any, validationMessageView: { minValueFlag: boolean; maxValueFlag: boolean; errMandateFlag: boolean; errMinValueFlag: boolean; errMaxValueFlag: boolean; errMinLengthFlag: boolean; errMaxLengthFlag: boolean; errEmailFlag: boolean; ipPatternFlag: boolean; errPatternFlag: boolean; }): any {
    if (userDefinedValidation) {
      validationMessageView = this.resetValidationFlagsUD(validationMessageView);
      userDefinedValidation.forEach(element => {
        switch (element) {
          case 'required': validationMessageView.errMandateFlag = true;
                           break;
          case 'min': validationMessageView.minValueFlag = true; validationMessageView.errMinValueFlag = true;
                      break;
          case 'max': validationMessageView.maxValueFlag = true; validationMessageView.errMaxValueFlag = true;
                      break;
          case 'minlength': validationMessageView.minValueFlag = true; validationMessageView.errMinLengthFlag = true;
                            break;
          case 'maxlength': validationMessageView.maxValueFlag = true; validationMessageView.errMaxLengthFlag = true;
                            break;
          case 'email': validationMessageView.errEmailFlag = true;
                        break;
          case 'pattern': validationMessageView.errPatternFlag = true; validationMessageView.ipPatternFlag = true;
                          break;
        }
      });
    }
    return validationMessageView;
  }

  getUserDefinedValidations(formValUserDefined: any, ): any {
    const validationArr = [];
    formValUserDefined.validations.forEach(element => {
      const validationObj: Validation = {} as any;
      switch (element) {
        case 'required': validationObj.validationMsg = formValUserDefined.manadtoryMessage;
                         validationObj.validationName = element;
                         validationObj.value = null;
                         break;
        case 'min': validationObj.validationMsg = formValUserDefined.minimumLengthNumberErrorMessage;
                    validationObj.validationName = element;
                    validationObj.value = formValUserDefined.ipMinimumLength;
                    break;
        case 'max': validationObj.validationMsg = formValUserDefined.maximumLengthNumberErrorMessage;
                    validationObj.validationName = element;
                    validationObj.value = formValUserDefined.ipMaximumLength;
                    break;
        case 'minlength': validationObj.validationMsg = formValUserDefined.minimumLengthStringErrorMessage;
                          validationObj.validationName = element;
                          validationObj.value = formValUserDefined.ipMinimumLength;
                          break;
        case 'maxlength': validationObj.validationMsg = formValUserDefined.maximumLengthStringErrorMessage;
                          validationObj.validationName = element;
                          validationObj.value = formValUserDefined.ipMaximumLength;
                          break;
        case 'email': validationObj.validationMsg = formValUserDefined.emailErrorMessage;
                      validationObj.validationName = element;
                      validationObj.value = null;
                      break;
        case 'pattern': validationObj.validationMsg = formValUserDefined.patternErrorMessage;
                        validationObj.validationName = element;
                        validationObj.value = formValUserDefined.ipPattern;
                        break;
      }
      validationArr.push(validationObj);
    });
    return validationArr;
  }

  bindUserDefinedDataOnEditKpi(kpi: any, userDefinedform: any, fieldGroup: any, jsonDataValidationMsg: any) {
    if (kpi && kpi.validations && kpi.validations.length > 0) {
      const arrValidations = kpi.validations.map(element => {
        return element.validationName;
      });
      userDefinedform.controls.validations.setValue(arrValidations);
      userDefinedform = this.bindValidationUD(arrValidations, userDefinedform, jsonDataValidationMsg, kpi.validations);
    } else {
      userDefinedform.controls.validations.setValue([]);
    }
    userDefinedform.controls.dfnOrder.setValue(kpi.dfnOrder);
    userDefinedform.controls.dfnId.setValue(kpi.dfnId);
    userDefinedform.controls.dfnName.setValue(kpi.dfnName);
    userDefinedform.controls.groupId.setValue(fieldGroup.fieldGrpId);
    userDefinedform.controls.webScrap.setValue(kpi.isWebScrap);
    userDefinedform.controls.teamName.setValue(kpi.teamName);
    userDefinedform.controls.actionToView.setValue(kpi.action);
    if (kpi.action.toLowerCase().includes('score')) {
      userDefinedform.controls.maxWeightageScoringInput.setValue(10);
    } else {
      userDefinedform.controls.maxWeightageScoringInput.setValue('');
    }
    userDefinedform.controls.componentType.setValue(kpi.fieldType);
    userDefinedform.controls.maxWeightageScoringInput.setValue(kpi.maxWeightage);
    return userDefinedform;
  }

  bindValidationUD(validationList: any, userDefinedform: any, jsonDataValidationMsg: any, onEditValidationInfos: any): any {
    if (validationList) {
      validationList.forEach(element => {
        switch (element) {
          case 'required':
            userDefinedform.controls.manadtoryMessage.setValue(this.commonService.getUniqueObjectFromArr(onEditValidationInfos, 'validationName', element) ? this.commonService.getUniqueObjectFromArr(onEditValidationInfos, 'validationName', element).validationMsg : this.commonService.getUniqueObjectFromArr(jsonDataValidationMsg, 'value', element).defaultMessage);
            userDefinedform.controls.manadtoryMessage.setValidators((Validators.required));
            break;
          case 'min':
            userDefinedform.controls.ipMinimumLength.setValue(this.commonService.getUniqueObjectFromArr(onEditValidationInfos, 'validationName', element) ? this.commonService.getUniqueObjectFromArr(onEditValidationInfos, 'validationName', element).value : this.commonService.getUniqueObjectFromArr(jsonDataValidationMsg, 'value', element).defaultlength),
              userDefinedform.controls.minimumLengthNumberErrorMessage.setValue(this.commonService.getUniqueObjectFromArr(onEditValidationInfos, 'validationName', element) ? this.commonService.getUniqueObjectFromArr(onEditValidationInfos, 'validationName', element).validationMsg : this.commonService.getUniqueObjectFromArr(jsonDataValidationMsg, 'value', element).defaultMessage),
              userDefinedform.controls.ipMinimumLength.setValidators((Validators.required)),
              userDefinedform.controls.minimumLengthNumberErrorMessage.setValidators((Validators.required));
            break;
          case 'max':
            userDefinedform.controls.ipMaximumLength.setValue(this.commonService.getUniqueObjectFromArr(onEditValidationInfos, 'validationName', element) ? this.commonService.getUniqueObjectFromArr(onEditValidationInfos, 'validationName', element).value : this.commonService.getUniqueObjectFromArr(jsonDataValidationMsg, 'value', element).defaultlength),
              userDefinedform.controls.maximumLengthNumberErrorMessage.setValue(this.commonService.getUniqueObjectFromArr(onEditValidationInfos, 'validationName', element) ? this.commonService.getUniqueObjectFromArr(onEditValidationInfos, 'validationName', element).validationMsg : this.commonService.getUniqueObjectFromArr(jsonDataValidationMsg, 'value', element).defaultMessage);
            userDefinedform.controls.ipMaximumLength.setValidators((Validators.required)),
              userDefinedform.controls.maximumLengthNumberErrorMessage.setValidators((Validators.required));
            break;
          case 'minlength':
            userDefinedform.controls.minimumLengthStringErrorMessage.setValue(this.commonService.getUniqueObjectFromArr(onEditValidationInfos, 'validationName', element) ? this.commonService.getUniqueObjectFromArr(onEditValidationInfos, 'validationName', element).validationMsg : this.commonService.getUniqueObjectFromArr(jsonDataValidationMsg, 'value', element).defaultMessage),
              userDefinedform.controls.ipMinimumLength.setValue(this.commonService.getUniqueObjectFromArr(onEditValidationInfos, 'validationName', element) ? this.commonService.getUniqueObjectFromArr(onEditValidationInfos, 'validationName', element).value : this.commonService.getUniqueObjectFromArr(jsonDataValidationMsg, 'value', element).defaultlength);
            userDefinedform.controls.ipMinimumLength.setValidators((Validators.required)),
              userDefinedform.controls.minimumLengthStringErrorMessage.setValidators((Validators.required));
            break;
          case 'maxlength':
            userDefinedform.controls.maximumLengthStringErrorMessage.setValue(this.commonService.getUniqueObjectFromArr(onEditValidationInfos, 'validationName', element) ? this.commonService.getUniqueObjectFromArr(onEditValidationInfos, 'validationName', element).validationMsg : this.commonService.getUniqueObjectFromArr(jsonDataValidationMsg, 'value', element).defaultMessage),
              userDefinedform.controls.ipMaximumLength.setValue(this.commonService.getUniqueObjectFromArr(onEditValidationInfos, 'validationName', element) ? this.commonService.getUniqueObjectFromArr(onEditValidationInfos, 'validationName', element).value : this.commonService.getUniqueObjectFromArr(jsonDataValidationMsg, 'value', element).defaultlength);
            userDefinedform.controls.ipMaximumLength.setValidators((Validators.required)),
              userDefinedform.controls.maximumLengthStringErrorMessage.setValidators((Validators.required));
            break;
          case 'email':
            userDefinedform.controls.emailErrorMessage.setValue(this.commonService.getUniqueObjectFromArr(onEditValidationInfos, 'validationName', element) ? this.commonService.getUniqueObjectFromArr(onEditValidationInfos, 'validationName', element).validationMsg : this.commonService.getUniqueObjectFromArr(jsonDataValidationMsg, 'value', element).defaultMessage);
            userDefinedform.controls.emailErrorMessage.setValidators((Validators.required));
            break;
          case 'pattern':
            userDefinedform.controls.ipPattern.setValue(this.commonService.getUniqueObjectFromArr(onEditValidationInfos, 'validationName', element) ? this.commonService.getUniqueObjectFromArr(onEditValidationInfos, 'validationName', element).value : 'Enter Pattern.'),
              userDefinedform.controls.patternErrorMessage.setValue(this.commonService.getUniqueObjectFromArr(onEditValidationInfos, 'validationName', element) ? this.commonService.getUniqueObjectFromArr(onEditValidationInfos, 'validationName', element).validationMsg : this.commonService.getUniqueObjectFromArr(jsonDataValidationMsg, 'value', element).defaultMessage);
            userDefinedform.controls.ipPattern.setValidators((Validators.required)),
              userDefinedform.controls.patternErrorMessage.setValidators((Validators.required));
            break;
        }
      });
      return userDefinedform;
    }
  }

  bindPreDefinedDataOnEditKpi(kpi: any, preDefinedform: any, fieldGroup: any) {
    preDefinedform.controls.dfnOrder.setValue(kpi.dfnOrder);
    preDefinedform.controls.dfnId.setValue(kpi.dfnId);
    preDefinedform.controls.dfnName.setValue(kpi.dfnName);
    preDefinedform.controls.groupId.setValue(fieldGroup.fieldGrpId);
    preDefinedform.controls.webScrap.setValue(kpi.isWebScrap);
    preDefinedform.controls.teamName.setValue(kpi.teamName);
    preDefinedform.controls.actionToView.setValue(kpi.action);
    if (kpi.action.toLowerCase().includes('score')) {
      preDefinedform.controls.maxWeightageScoringInput.setValue(10);
    } else {
      preDefinedform.controls.maxWeightageScoringInput.setValue('');
    }
    preDefinedform.controls.maxWeightageScoringInput.setValue(kpi.maxWeightage);
    if (kpi.validations && kpi.validations.length > 0) {
      preDefinedform.controls.mandatory.setValue(true);
      preDefinedform.controls.mandatoryMessage.setValue(kpi.validations[0].validationMsg);
    } else {
      preDefinedform.controls.mandatory.setValue(false);
      preDefinedform.controls.mandatoryMessage.setValue('');
    }
    return preDefinedform;
  }
  getConfigurationAPI(): any {
    return this.dataService.externalGet(API.getConfigureKPIJson);
  }

  getKPIConfiguration(businessType: any): any {
    return this.onBoardingService.getprofileinfos(businessType).pipe(catchError(this.handleError));
  }

  getGroupValues(): any {
    return this.onBoardingService.listFieldGroups().pipe(catchError(this.handleError));
  }

  getProspectProfileData(): any {
    return this.dataService.externalGet(`${ApiConfigService.urls.panelData.panelDataUrl}/active_kpis`);
  }

  createGroup(data: FieldGroupEntry): any {
    return this.onBoardingService.createFieldGroup(data).pipe(catchError(this.handleError));
  }

  saveConfigurationForm(data: any): any {
    return this.onBoardingService.createProfileInfo(data).pipe(catchError(this.handleError));
  }

  updateConfigurationForm(data: any): any {
    return this.onBoardingService.updateProfileInfo(data).pipe(catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse): any {
    return throwError(error);
  }
}
