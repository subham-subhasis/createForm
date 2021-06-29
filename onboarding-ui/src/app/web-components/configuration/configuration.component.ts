import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild, Inject, Input, OnChanges } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormGroup, FormBuilder, Validators, NgForm, FormGroupDirective, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { validationPatterns, customMessages } from 'src/app/common/utils/constants';
import { ConfigureService } from './service/configure.service';
import { CommonService } from 'src/app/common/services/common.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ElementInterarctionService } from '../element-interaction-service/element-interarction-service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(
          ':enter',
          [
            style({ height: 0, opacity: 0 }),
            animate('1s ease-out')
          ]
        ),
        transition(
          ':leave',
          [
            animate('1s ease-in', style({ height: 0, opacity: 0 }))
          ]
        )
      ]
    )
  ]
})
export class ConfigurationComponent implements OnInit, OnDestroy, OnChanges {
  @Input() userid: number = 0;
  @Input() username: string;
  loader = false;
  patterns = validationPatterns;
  formData = { isPanelDataIntegration: false, editFlag: false, editKPIFlag: false, editKPiIndex: 0, confirmMessgae: '', switchFormUserDefined: false, businessType: '', groupName: '', preDefinedformData: { webScrapEnable: true }, userDefinedformData: { chipData: [], chipFlag: false, gridFlag: false }, preDefinfedTable: { typeInput: '', valueInput: '', weightageTableData: [] }, userDefinfedTable: { typeInput: '', valueInput: '', weightageTableData: [] }, useProfileProspecting: false, accountDetails: '', basicDetails: '' };
  jsonData = { businessTypes: [], userDefinedTypes: [], userDefinedValiations: [], userDefinedValiationsWithFilter: [], teams: [], actions: [], basicDetailsGroupData: [], kpiDefinationsPreDefined: [] };
  apiQueryData = { groupDetails: [], prospectProfileDetails: [] };
  formAction = { confirmDialog: false, groupCreateFromSubmit: false, predefinedAddtoTableSubmit: false, userdefinedAddtoTableSubmit: false, leftFormSubmit: false, };
  deleteGroupData = { grpId: null };
  submitForm: any = [];
  validationMessageView = { minValueFlag: false, maxValueFlag: false, errMandateFlag: false, errMinValueFlag: false, errMaxValueFlag: false, errMinLengthFlag: false, errMaxLengthFlag: false, errEmailFlag: false, ipPatternFlag: false, errPatternFlag: false };
  preDefinedform: FormGroup;
  userDefinedform: FormGroup;
  displayedColumns = ['position', 'type', 'weightageVal', 'symbol'];
  displayedColumnsViewOnly = ['type', 'weightageVal'];
  dataSourceFortable = { preDefinedDataSouce: new MatTableDataSource([]), userDefinedDataSouce: new MatTableDataSource([]) };
  matchipconfig = { selectable: true, removable: true, addOnBlur: true, separatorKeysCodes: [ENTER, COMMA] };
  @Input() screenActions: any;
  
  getConfigurationSubscription: Subscription;
  createGroupSubscription: Subscription;
  getGroupValuesSubscription: Subscription;
  submitConfiguredFormSubscription: Subscription;
  updateConfiguredFormSubscription: Subscription;
  deleteGroupSubscription: Subscription;
  getProspectProfileDetailsSubscription: Subscription;

  @ViewChild(FormGroupDirective, { static: false }) formGroupDirective: FormGroupDirective;
  constructor( private formBuilder: FormBuilder,
               private configureService: ConfigureService,
               private commonService: CommonService,
               private dialog: MatDialog,
               private elementInterarctionService: ElementInterarctionService) {
               }
  ngOnChanges() {
    if(this.userid) {
      setTimeout(() => {
        this.commonService.userId = this.userid;
        this.commonService.userName = this.username;
      });
    }
  }

  ngOnInit() {
    const screenActions = sessionStorage.getItem('configurationScreenActions');
    this.screenActions = JSON.parse(screenActions);
    setTimeout(() => {
      let sessionUserId = sessionStorage.getItem('sessionUserData');
      this.userid = this.commonService.decryptData(sessionUserId);
      this.commonService.userId = this.userid;
      let sessionUserName = sessionStorage.getItem('sessionUserName');
      this.username = this.commonService.decryptData(sessionUserName);
      this.commonService.userName = this.username;
      this.getGroupDetails();
    });
    this.formData.confirmMessgae = customMessages.confirmMessgae;
    this.initialDataConfigure();
    this.commonService.hideToaster();
    sessionStorage.removeItem('configurationScreenActions');
  }

  progressLoader(status: boolean) {
    status ? (this.loader = status) : setTimeout(() => {
      this.loader = status;
    }, 500);
  }

  onModalClick(event: any) {
    if (event === 'close') {
      this.formAction.confirmDialog = false;
    } else if (event === 'yes') {
      this.formAction.confirmDialog = false;
      this.deleteGroup();
    }
  }

  formatKPIName(kpiName: string): string {
    if (kpiName) {
      kpiName = kpiName.replace(/_/g, ' ');
    }
    return kpiName;
  }

  checkValLesser(val) {
    if (parseFloat(val) > 10.0) {
      return true;
    } else { return false; }
  }

  deleteGroupModal(data: any) {
    const fieldGrpNameVal = this.commonService.getUniqueObjectFromArr(this.apiQueryData.groupDetails, 'fieldGrpId', data).fieldGrpName;
    if ( fieldGrpNameVal === this.formData.basicDetails || fieldGrpNameVal === this.formData.accountDetails) {
      this.commonService.showWarningToaster(customMessages.errorDeleteGroupBasicDetails);
    } else {
      this.formAction.confirmDialog = true;
      this.deleteGroupData.grpId = data;
    }
  }

  manualSwitchChange(value: boolean) {
    this.formData.switchFormUserDefined = !value;
  }

  minimizeGroup(group: any) {
    group.definitions.forEach(element => {
      element.panelOpenState = false;
    });
  }

  findFieldTypeName(key: string) {
    const retArrField = this.commonService.getUniqueArrayFromDiffArrStringMatch(this.jsonData.userDefinedTypes, 'value', key);
    if (key && retArrField && retArrField.length > 0) {
      return retArrField[0].name;
    } else {
      return '';
    }
  }

  onChangeProfileProspect() {
    this.mannualReseUserDefinedForProspecting();
    if (this.formData.useProfileProspecting) {
      this.userDefinedform.controls.dfnName.clearValidators();
      this.userDefinedform.controls.actionToView.setValue('score'); //form-control-disabled-manual
      this.changeAction('userDefined', { value: 'score' });
      this.userDefinedform.controls.maxWeightageScoringInput.setValue('10');
      this.userDefinedform.controls.componentType.setValue('grid');
      this.changeUserDefinedType('grid');
    }
  }

  mannualReseUserDefinedForProspecting() {
    this.configureUserDefinedFormGroup();
    this.validationMessageView = this.configureService.resetValidationFlagsUD(this.validationMessageView);
    this.userDefinedform = this.configureService.resetValidationMessage(this.userDefinedform, this.jsonData.userDefinedValiations);
    this.formData.userDefinedformData.chipData = [];
    this.formData.userDefinfedTable.weightageTableData = [];
    this.dataSourceFortable.userDefinedDataSouce = new MatTableDataSource([]);
    this.formData.userDefinedformData.chipFlag = this.formData.userDefinedformData.gridFlag = false;
    this.formAction.userdefinedAddtoTableSubmit = false;
  }

  configurePreDefinedFormGroup() {
    this.preDefinedform = this.formBuilder.group({
      dfnId: [''],
      dfnName: ['', Validators.required],
      dfnOrder: [''],
      groupId: ['', Validators.required],
      teamName: [''],
      actionToView: ['', Validators.required],
      maxWeightageScoringInput: [{ value: '', disabled: false }],
      webScrap: [{ value: false, disabled: false }],
      mandatory: [false],
      mandatoryMessage: [null]
    });
  }

  configureUserDefinedFormGroup() {
    this.userDefinedform = this.formBuilder.group({
      useProfileProspecting: [false],
      dfnId: [''],
      dfnName: [''],
      dfnOrder: [''],
      groupId: ['', Validators.required],
      teamName: [''],
      componentType: ['', Validators.required],
      validations: [],
      actionToView: ['', Validators.required],
      maxWeightageScoringInput: [{ value: '', disabled: false }],
      webScrap: [''],
      chipValueAdded: [''],
      manadtoryMessage: [''],
      ipMinimumLength: [''],
      minimumLengthNumberErrorMessage: [''],
      ipMaximumLength: [''],
      maximumLengthNumberErrorMessage: [''],
      minimumLengthStringErrorMessage: [''],
      maximumLengthStringErrorMessage: [''],
      emailErrorMessage: [''],
      ipPattern: [''],
      patternErrorMessage: ['']
    });
  }

  initialDataConfigure() {
    this.pageLoadDataFromJSON();
    this.configurePreDefinedFormGroup();
    this.configureUserDefinedFormGroup();
  }

  objectWithoutProperties(obj: any, keys: any): any {
    const target = Object.assign({}, obj);
    delete target.weightageForMatTable;
    return target;
  }

  dragdropGroup(event: CdkDragDrop<any>) {
    this.submitForm && moveItemInArray(this.submitForm, event.previousIndex, event.currentIndex);
  }

  dragdropKPI(event: CdkDragDrop<any>, arrDefinitions: any) {
    arrDefinitions && moveItemInArray(arrDefinitions, event.previousIndex, event.currentIndex);
  }

  addRowToExsisitngTable(formType: string, type: string, value: string, form: NgForm) {
    const element: Element = {} as any;
    element.type = type;
    element.weightageVal = parseFloat(value);
    if (formType === 'preDefined') {
      this.formData.preDefinfedTable.weightageTableData.push(element);
      this.dataSourceFortable.preDefinedDataSouce = new MatTableDataSource(this.formData.preDefinfedTable.weightageTableData);
      this.formAction.predefinedAddtoTableSubmit = false;
      form.form.reset();
    } else {
      this.formData.userDefinfedTable.weightageTableData.push(element);
      this.dataSourceFortable.userDefinedDataSouce = new MatTableDataSource(this.formData.userDefinfedTable.weightageTableData);
      this.formAction.userdefinedAddtoTableSubmit = false;
      form.form.reset();
    }
  }

  removeRowToExsisitngTable(formType: string, index: number) {
    if (formType.toLowerCase() === 'predefined') {
      this.formData.preDefinfedTable.weightageTableData.splice(index, 1);
      this.dataSourceFortable.preDefinedDataSouce = new MatTableDataSource(this.formData.preDefinfedTable.weightageTableData);
    } else {
      this.formData.userDefinfedTable.weightageTableData.splice(index, 1);
      this.dataSourceFortable.userDefinedDataSouce = new MatTableDataSource(this.formData.userDefinfedTable.weightageTableData);
    }
  }

  resetTableData(formType: string) {
    if (formType.toLowerCase() === 'predefined') {
      this.formData.preDefinfedTable.weightageTableData = [];
      this.dataSourceFortable.preDefinedDataSouce = new MatTableDataSource(this.formData.preDefinfedTable.weightageTableData);
    } else {
      this.formData.userDefinfedTable.weightageTableData = [];
      this.dataSourceFortable.userDefinedDataSouce = new MatTableDataSource(this.formData.userDefinfedTable.weightageTableData);
    }
  }

  changeAction(formType: string, event: any) {
    formType.toLowerCase() === 'predefined' ? this.preDefinedform.controls.maxWeightageScoringInput.setValue('') : this.userDefinedform.controls.maxWeightageScoringInput.setValue('');
    if (event.value.toLowerCase().includes('score')) {
      formType.toLowerCase() === 'predefined' ? (this.preDefinedform.controls.maxWeightageScoringInput.setValue(10)) : (this.userDefinedform.controls.maxWeightageScoringInput.setValue(10));
    } else {
      formType.toLowerCase() === 'predefined' ? (this.preDefinedform.controls.maxWeightageScoringInput.setValue('')) : (this.userDefinedform.controls.maxWeightageScoringInput.setValue(''));
    }
  }

  changeDefinitionPredefined(val: any) {
    this.resetTableData('preDefined');
    this.formAction.predefinedAddtoTableSubmit = false;
    this.formData.preDefinfedTable.typeInput = this.formData.preDefinfedTable.valueInput = '';
    const objDfn = this.jsonData.kpiDefinationsPreDefined.filter((value: { name: any; }) => val === value.name);
    this.preDefinedform.controls.maxWeightageScoringInput.setValue(objDfn[0].maxKPIScore);
    this.formData.preDefinfedTable.weightageTableData = objDfn[0].weighatgeValues;
    objDfn[0].webScrapFlag ? (this.preDefinedform.controls.webScrap.setValue(true)) : (this.preDefinedform.controls.webScrap.setValue(false));
    this.dataSourceFortable.preDefinedDataSouce = new MatTableDataSource(this.formData.preDefinfedTable.weightageTableData);
  }

  changeUserDefinedType(type: any) {
    this.userDefinedform.controls.validations.setValue([]);
    this.userDefinedform.removeControl('chipValueAdded');
    this.userDefinedform = this.configureService.resetValidationMessage(this.userDefinedform, this.jsonData.userDefinedValiations);
    this.formData.userDefinedformData.chipFlag = this.formData.userDefinedformData.gridFlag = false;
    this.validationMessageView = this.configureService.resetValidationFlagsUD(this.validationMessageView);
    const typeObj = this.commonService.getUniqueObjectFromArr(this.jsonData.userDefinedTypes, 'value', type);
    this.jsonData.userDefinedValiationsWithFilter = this.jsonData.userDefinedValiations.filter(val => val.includeArr.includes(typeObj.id));
    type.toLowerCase() === 'select' && (this.formData.userDefinedformData.chipFlag = true, this.userDefinedform.addControl('chipValueAdded', new FormControl('', Validators.required)));
    type.toLowerCase() === 'multiselect' && (this.formData.userDefinedformData.chipFlag = true, this.userDefinedform.addControl('chipValueAdded', new FormControl('', Validators.required)));
    type.toLowerCase() === 'grid' && (this.formData.userDefinedformData.gridFlag = true);
  }

  changeUserDefinedValidation(event: any, editKPI: boolean) {
    if (!event) {
      this.userDefinedform && this.userDefinedform.value && this.userDefinedform.value.validations && (this.validationMessageView = this.configureService.validationFieldsUD(this.userDefinedform.value.validations, this.validationMessageView));
      if (!editKPI) {
        this.userDefinedform && this.userDefinedform.value && this.userDefinedform.value.validations && (this.userDefinedform = this.configureService.bindValidationUD(this.userDefinedform.value.validations, this.userDefinedform, this.jsonData.userDefinedValiations, []));
      }
    }
  }

  removeValueFromChipData(val: any) {
    const index = this.formData.userDefinedformData.chipData.indexOf(val);
    index >= 0 && this.formData.userDefinedformData.chipData.splice(index, 1);
  }

  addValuesToChipData(event: any) {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      this.formData.userDefinedformData.chipData.push(value.trim());
    }
    if (input) {
      input.value = '';
    }
  }

  cancelEditKPI(formType: string ) {
    const objKPIOnCancel = this.configureService.fetchEditKPIDeatails();
    let selectedGroupId = -1;
    if (formType.toLowerCase() === 'predefined') {
      selectedGroupId = this.preDefinedform.value.groupId;
    } else {
      selectedGroupId = this.userDefinedform.value.groupId;
    }
    for ( let i = 0; i < this.submitForm.length; i++ ) {
      if (this.submitForm[i].fieldGroup && this.submitForm[i].fieldGroup.fieldGrpId === objKPIOnCancel.fieldGroup.fieldGrpId) {
        if (selectedGroupId === objKPIOnCancel.fieldGroup.fieldGrpId) {
          this.submitForm[i].definitions.splice(objKPIOnCancel.indexOfKPI, 0, objKPIOnCancel.kpi);
        } else {
          this.submitForm[i].definitions.push(objKPIOnCancel.kpi);
        }
        this.submitForm[i].definitions.forEach(element => {
          if (element.weightages && element.weightages.length > 0 && element.dfnName.toLowerCase() === objKPIOnCancel.kpi.dfnName.toLowerCase()) {
            element.weightages = [];
            element.weightages = objKPIOnCancel.weightagesBackUp;
            element.weightageForMatTable = new MatTableDataSource(element.weightages);
          }
        });
        break;
      }
    }
    this.resetFormAfterSubmit(formType);
  }

  checkGridNotEmpty(formType: string, formValPreDefined: any, formValUserDefined: any) {
    let valid = true;
    if (formType.toLowerCase() === 'predefined') {
      if (this.formData.preDefinfedTable.weightageTableData && this.formData.preDefinfedTable.weightageTableData.length === 0) {
        valid = false;
      }
    } else {
      if (formValUserDefined.componentType.toLowerCase() === 'grid') {
        if (this.formData.userDefinfedTable.weightageTableData && this.formData.userDefinfedTable.weightageTableData.length === 0) {
          valid = false;
        }
      }
    }
    return valid;
  }

  addKPItoGroup(formType: string, validForm: boolean) {
    if (this.formData.businessType && this.formData.businessType.length > 0) {
      const formValPreDefined = this.preDefinedform.value;
      const formValUserDefined = this.userDefinedform.value;
      if (validForm) {
        if (this.checkGridNotEmpty(formType, formValPreDefined, formValUserDefined)) {
          const groupOrder = -1;
          const collapse = false;
          let objFieldGroup: any = {};
          let objDefinition: any = {};
          if (formType.toLowerCase() === 'predefined') {
            const fieldGrpNameVal = this.commonService.getUniqueObjectFromArr(this.apiQueryData.groupDetails, 'fieldGrpId', formValPreDefined.groupId).fieldGrpName;
            objDefinition = this.formPreDefinedObjDefinition(objDefinition, formValPreDefined);
            objFieldGroup = { fieldGrpId: formValPreDefined.groupId, fieldGrpName: fieldGrpNameVal };
            const objGroupExsistCheck = this.checkGroupExsist(formValPreDefined.groupId, this.submitForm);
            if (objGroupExsistCheck.exsist) {
              const groupPresentArr = this.commonService.getUniqueArrayFromDiffArrStringMatch(objGroupExsistCheck.definitions, 'dfnName', formValPreDefined.dfnName);
              if (groupPresentArr && groupPresentArr.length === 0) {
                this.pushDataToKPIDefinitionsArr(objDefinition, formValPreDefined.groupId);
                this.resetFormAfterSubmit(formType);
              } else {
                this.commonService.showErrorToaster(customMessages.errorMessageToAddDuplicateKPI);
              }
            } else {
              this.pushDataToSubmitArr(groupOrder, collapse, objFieldGroup, objDefinition);
              this.resetFormAfterSubmit(formType);
            }
          } else {
            const fieldGrpNameVal = this.commonService.getUniqueObjectFromArr(this.apiQueryData.groupDetails, 'fieldGrpId', formValUserDefined.groupId).fieldGrpName;
            objFieldGroup = { fieldGrpId: formValUserDefined.groupId, fieldGrpName: fieldGrpNameVal };
            objDefinition = this.formUserDefinedObjDefinition(objDefinition, formValUserDefined);
            const objGroupExsistCheck = this.checkGroupExsist(formValUserDefined.groupId, this.submitForm);
            if (objGroupExsistCheck.exsist) {
              const groupPresentArr = this.commonService.getUniqueArrayFromDiffArrStringMatch(objGroupExsistCheck.definitions, 'dfnName', formValUserDefined.dfnName);
              if (groupPresentArr && groupPresentArr.length === 0) {
                this.pushDataToKPIDefinitionsArr(objDefinition, formValUserDefined.groupId);
                this.resetFormAfterSubmit(formType);
              } else {
                this.commonService.showErrorToaster(customMessages.errorMessageToAddDuplicateKPI);
              }
            } else {
              this.pushDataToSubmitArr(groupOrder, collapse, objFieldGroup, objDefinition);
              this.resetFormAfterSubmit(formType);
            }
          }
        } else {
          this.commonService.showErrorToaster(customMessages.errorMessageForGridData);
        }
      } else {
        this.commonService.showErrorToaster(customMessages.errorMessageForFillAllFileds);
      }
    } else {
      this.formAction.leftFormSubmit = true;
      this.commonService.showErrorToaster(customMessages.errorMessageForBusinessType);
    }
  }

  resetFormAfterSubmit(formType: string) {
    this.formData.editKPIFlag = false;
    this.formData.useProfileProspecting = false;
    this.formData.editKPiIndex = 0;
    if (formType.toLowerCase() === 'predefined') {
      this.configurePreDefinedFormGroup();
      this.formData.preDefinfedTable.weightageTableData = [];
      this.dataSourceFortable.preDefinedDataSouce = new MatTableDataSource([]);
      this.formData.preDefinedformData.webScrapEnable = true;
      this.formAction.predefinedAddtoTableSubmit = false;
    } else {
      this.configureUserDefinedFormGroup();
      this.validationMessageView = this.configureService.resetValidationFlagsUD(this.validationMessageView);
      this.userDefinedform = this.configureService.resetValidationMessage(this.userDefinedform, this.jsonData.userDefinedValiations);
      this.formData.userDefinedformData.chipData = [];
      this.formData.userDefinfedTable.weightageTableData = [];
      this.dataSourceFortable.userDefinedDataSouce = new MatTableDataSource([]);
      this.formData.userDefinedformData.chipFlag = this.formData.userDefinedformData.gridFlag = false;
      this.formAction.userdefinedAddtoTableSubmit = false;
    }
    setTimeout(() => this.formGroupDirective.resetForm(), 0);
  }

  formUserDefinedObjDefinition(objDefinition: any, formValUserDefined: any): any {
    objDefinition = {
      //useProfileProspecting: this.formData.useProfileProspecting,
      dfnId: formValUserDefined.dfnId ? formValUserDefined.dfnId : null,
      dfnName: formValUserDefined.dfnName,
      dfnCategory: 'U',
      isWebScrap: this.formData.useProfileProspecting,
      action: formValUserDefined.actionToView,
      dfnOrder: formValUserDefined.dfnOrder ? formValUserDefined.dfnOrder : -1,
      fieldType: formValUserDefined.componentType,
      profileName: this.formData.businessType,
      teamName: '',
      maxWeightage: (formValUserDefined.maxWeightageScoringInput ? formValUserDefined.maxWeightageScoringInput : null)
    };
    formValUserDefined.componentType === 'select' && (objDefinition['fieldOptions'] = this.formData.userDefinedformData.chipData ? this.formData.userDefinedformData.chipData.toString() : null);
    formValUserDefined.componentType === 'multiselect' && (objDefinition['fieldOptions'] = this.formData.userDefinedformData.chipData ? this.formData.userDefinedformData.chipData.toString() : null);
    if (formValUserDefined.componentType === 'grid') {
      objDefinition['maxWeightage'] = (formValUserDefined.maxWeightageScoringInput ? formValUserDefined.maxWeightageScoringInput : -1);
      const tableWeighatgesInfo = this.getTableWeighatgesInfo('üserDefined');
      objDefinition.weightages = tableWeighatgesInfo ? tableWeighatgesInfo : [];
      objDefinition.weightageForMatTable = new MatTableDataSource(tableWeighatgesInfo);
    }
    objDefinition.validations = this.configureService.getUserDefinedValidations(formValUserDefined);
    return objDefinition;
  }

  formPreDefinedObjDefinition(objDefinition: any, formValPreDefined: any): any {
    const validationsArr = [];
    const validationObj: Validation = {} as any;
    if (formValPreDefined.mandatory) {
      validationObj.validationMsg = formValPreDefined.mandatoryMessage;
      validationObj.validationName = 'required';
      validationObj.value = null;
      validationsArr.push(validationObj);
    }
    const tableWeighatgesInfo = this.getTableWeighatgesInfo('preDefined');
    return objDefinition = {
      dfnId: formValPreDefined.dfnId ? formValPreDefined.dfnId : null,
      dfnName: formValPreDefined.dfnName,
      dfnCategory: 'P',
      isWebScrap: formValPreDefined.webScrap ? true : false,
      action: formValPreDefined.actionToView,
      maxWeightage: formValPreDefined.maxWeightageScoringInput ? formValPreDefined.maxWeightageScoringInput : null,
      dfnOrder: formValPreDefined.dfnOrder ? formValPreDefined.dfnOrder : -1,
      fieldType: 'grid',
      profileName: this.formData.businessType,
      teamName: '',
      weightages: tableWeighatgesInfo ? tableWeighatgesInfo : [],
      weightageForMatTable: new MatTableDataSource(tableWeighatgesInfo),
      validations: validationsArr
    };
  }

  getTableWeighatgesInfo(formType: string): any {
    if (formType.toLowerCase() === 'predefined') {
      return this.formData.preDefinfedTable.weightageTableData.map((obj: any) => {
        return { type: obj.type, weightageVal: obj.weightageVal, id: (obj.id ? obj.id : null) };
      });
    } else {
      return this.formData.userDefinfedTable.weightageTableData.map((obj: any) => {
        return { type: obj.type, weightageVal: obj.weightageVal, id: (obj.id ? obj.id : null) };
      });
    }
  }

  pushDataToSubmitArr(groupOrder: number, collapse: boolean, objFieldGroup: any, objDefinition: any) {
    const objSubmitData = { groupOrder: 0, collapse: false, fieldGroup: {}, definitions: [] };
    objSubmitData.groupOrder = groupOrder;
    objSubmitData.collapse = collapse;
    objSubmitData.fieldGroup = objFieldGroup;
    objSubmitData.definitions.push(objDefinition);
    this.submitForm.push(objSubmitData);
  }

  pushDataToKPIDefinitionsArr(objDefinition: any, groupId: any) {
    const objKPIOnCancel = this.configureService.fetchEditKPIDeatails();
    this.submitForm.forEach(group => {
      if (group.fieldGroup.fieldGrpId === groupId) {
        if (this.formData.editKPIFlag && objKPIOnCancel.fieldGroup.fieldGrpId === groupId) {
          group.definitions.splice(this.formData.editKPiIndex, 0, objDefinition);
        } else {
          group.definitions.push(objDefinition);
        }
        return;
      }
    });
  }

  checkGroupExsist(groupId: any, groupDetails: any[]): any {
    const objDefinitionIfEsisit = { exsist: false, definitions: [] };
    const arrGroup = this.commonService.getUniqueArrFromNestedObject(groupDetails, 'fieldGroup', 'fieldGrpId', groupId);
    if (arrGroup && arrGroup.length > 0) {
      objDefinitionIfEsisit.exsist = true;
      objDefinitionIfEsisit.definitions = arrGroup[0].definitions;
      return objDefinitionIfEsisit;
    }
    return objDefinitionIfEsisit;
  }

  deleteKpiFromRightGrid(kpi: any, grDefinitions: any, editKPIFlag: boolean, calledFromEdit: boolean) {
    if (editKPIFlag) {
      this.commonService.showErrorToaster(customMessages.errorMessageOnEditKPIMultiple);
    } else {
      if ( calledFromEdit ) {
        this.commonService.removeFromArrByAttribute(grDefinitions, 'dfnName' , kpi.dfnName);
      } else {
        const arrkpiBasicDetails = [];
        this.submitForm.forEach(obj => {
          if (obj.fieldGroup.fieldGrpName === this.formData.basicDetails ||
            obj.fieldGroup.fieldGrpName === this.formData.accountDetails) {
              obj.definitions.forEach(dfn => {
                arrkpiBasicDetails.push(dfn.dfnName);
              });
            }
        });
        if ( kpi.dfnName && arrkpiBasicDetails.indexOf(kpi.dfnName) === -1) {
          this.commonService.removeFromArrByAttribute(grDefinitions, 'dfnName' , kpi.dfnName);
        } else {
          this.commonService.showWarningToaster(customMessages.errorMessageDeleteKPIBasicDetails);
        }
      }
    }
  }

  editKpiFromRightGrid(kpi: any, grDefinitions: any, fieldGroup: any, editKPIFalg: boolean) {
    if (editKPIFalg) {
      this.commonService.showErrorToaster(customMessages.errorMessageOnEditKPIMultiple);
    } else {
      this.formData.editKPIFlag = true;
      const indexOfDefn = this.commonService.getFieldIndexSubmit(grDefinitions, 'dfnName' , kpi.dfnName);
      indexOfDefn && (this.formData.editKPiIndex = indexOfDefn);
      this.configureService.setEditKPIDeatails(fieldGroup, kpi, grDefinitions, indexOfDefn);
      kpi.dfnCategory.toLowerCase() === 'p' ? this.formData.switchFormUserDefined = false : this.formData.switchFormUserDefined = true;
      if (this.formData.switchFormUserDefined) {
        if (kpi && kpi.fieldType) {
          const typeObj = this.commonService.getUniqueObjectFromArr(this.jsonData.userDefinedTypes, 'value', kpi.fieldType);
          this.jsonData.userDefinedValiationsWithFilter = this.jsonData.userDefinedValiations.filter(val => val.includeArr.includes(typeObj.id));
        }
        this.userDefinedform = this.configureService.bindUserDefinedDataOnEditKpi(kpi, this.userDefinedform, fieldGroup, this.jsonData.userDefinedValiations);

        this.formData.useProfileProspecting = kpi.isWebScrap;
        this.formData.useProfileProspecting && this.changeAction('userDefined', {value: 'score'});

        this.userDefinedform && this.userDefinedform.value && this.userDefinedform.value.validations && (this.validationMessageView = this.configureService.validationFieldsUD(this.userDefinedform.value.validations, this.validationMessageView));
        if (kpi.fieldType.toLowerCase() === 'select' || kpi.fieldType.toLowerCase() === 'multiselect') {
          this.formData.userDefinedformData.chipData = kpi.fieldOptions ? kpi.fieldOptions.split(',') : [];
          this.formData.userDefinedformData.chipFlag = true;
        }
        if (kpi.fieldType.toLowerCase() === 'grid') {
          this.formData.userDefinedformData.gridFlag = true;
          this.dataSourceFortable.userDefinedDataSouce = new MatTableDataSource(kpi.weightages);
          this.formData.userDefinfedTable.weightageTableData = kpi.weightages;
        }
      } else {
        this.preDefinedform = this.configureService.bindPreDefinedDataOnEditKpi(kpi, this.preDefinedform, fieldGroup);
        this.dataSourceFortable.preDefinedDataSouce = new MatTableDataSource(kpi.weightages);
        this.formData.preDefinfedTable.weightageTableData = kpi.weightages;
        }
      this.deleteKpiFromRightGrid(kpi, grDefinitions, editKPIFalg, true );
    }
  }

  formatSubmitForm(): any {
    for (let k = 0; k < this.submitForm.length; k++) {
      this.submitForm[k].groupOrder = k + 1;
      const dfnitionsArr = [];
      for (let i = 0; i < this.submitForm[k].definitions.length; i++) {
        this.submitForm[k].definitions[i].dfnOrder = this.commonService.getFieldIndexSubmit(this.submitForm[k].definitions, 'dfnName', this.submitForm[k].definitions[i].dfnName) + 1;
        dfnitionsArr.push(this.objectWithoutProperties(this.submitForm[k].definitions[i], 'weightageForMatTable'));
      }
      this.submitForm[k].definitions = dfnitionsArr;
    }
    const saveForm = { profileName: this.formData.businessType, profileData: this.submitForm };
    return saveForm;
  }

  pageLoadDataFromJSON() {
    this.progressLoader(true), this.getConfigurationSubscription = this.configureService.getConfigurationAPI().subscribe((data: any) => {
      data ? (this.jsonData = this.configureService.bindPageloadJsonData(data[0].configure, this.jsonData)) : (this.jsonData = { businessTypes: [], userDefinedTypes: [], userDefinedValiations: [], teams: [], actions: [], userDefinedValiationsWithFilter: [], basicDetailsGroupData: [], kpiDefinationsPreDefined: [] });
      this.formData.basicDetails = data[0].configure.basicDetails;
      this.formData.accountDetails = data[0].configure.accountDeatils;
      this.submitForm = this.jsonData.basicDetailsGroupData;
      this.formData.isPanelDataIntegration = data[0].isPanelDataIntegration;
      if (this.formData.isPanelDataIntegration) {
        this.getProspectProfileDetails();
      }
    },
      err => {
        this.commonService.showErrorToaster(customMessages.errorMessageSubePanelData);
        this.progressLoader(false);
      });
  }

  createGroup(groupName: string) {
    if (groupName && groupName.length > 0) {
      const groupPresentArr = this.commonService.getUniqueArrayFromDiffArrStringMatch(this.apiQueryData.groupDetails, 'fieldGrpName', groupName);
      if (groupPresentArr.length === 0) {
        const obj = { fieldGrpName: groupName };
        this.progressLoader(true), this.createGroupSubscription = this.configureService.createGroup(obj).subscribe((data: any) => {
          this.commonService.showSuccessToaster(customMessages.groupCreatedSuccessMessage);
          this.formData.groupName = '';
          this.formAction.groupCreateFromSubmit = false;
          this.getGroupDetails();
        },
          err => {
            this.commonService.showErrorToaster(customMessages.errorMessage);
            this.progressLoader(false);
          });
      } else {
        this.commonService.showErrorToaster(customMessages.errorMessageToAddDuplicateGroup);
      }
    } else {
      this.commonService.showErrorToaster(customMessages.errorMessageToAddGroupValidation);
    }
  }

  getGroupDetails() {
    this.progressLoader(true), this.getGroupValuesSubscription = this.configureService.getGroupValues().subscribe((data: any) => {
      data ? (this.apiQueryData.groupDetails = data) : (this.apiQueryData.groupDetails = []);
      this.progressLoader(false);
    },
      err => {
        this.commonService.showErrorToaster(customMessages.errorMessage);
        this.progressLoader(false);
      });
  }

  getProspectProfileDetails() {
    this.progressLoader(true), this.getProspectProfileDetailsSubscription = this.configureService.getProspectProfileData().subscribe((data: any) => {
      this.progressLoader(false);
      if (data && data.length > 0) {
        this.apiQueryData.prospectProfileDetails = data;
        this.apiQueryData.prospectProfileDetails = this.apiQueryData.prospectProfileDetails.filter(kpi => kpi.is_scorable === 1);
      }
    },
      err => {
        this.commonService.showErrorToaster(customMessages.errorMessageSubePanelData);
        this.progressLoader(false);
      });
  }

  changeTypeOfBusniess(businessType: any) {
    this.progressLoader(true), this.getConfigurationSubscription = this.configureService.getKPIConfiguration(businessType).subscribe((data: any) => {
      this.progressLoader(false);
      this.formData.editKPIFlag = false;
      if ( data && data.length > 0) {
        this.formData.editFlag = true;
        this.formatSubmitFormToView(data[0].profileData);
      } else {
        this.submitForm = [];
        this.formData.editFlag = false;
        this.pageLoadDataFromJSON();
      }
      this.resetFormAfterSubmit('preDefined'); this.resetFormAfterSubmit('userDefined');
    },
    err => {
      this.commonService.showErrorToaster(customMessages.errorMessage);
      this.progressLoader(false);
    });
  }

  formatSubmitFormToView(profileData: any) {
    profileData && profileData.forEach(element => {
      element.definitions && element.definitions.forEach(dfn => {
        if ( dfn.weightages && dfn.weightages.length > 0 ) {
          dfn['weightageForMatTable'] = new MatTableDataSource(dfn.weightages);
        }
      });
    });
    this.addExtraSeededFieldGroup(profileData);
  }

  addExtraSeededFieldGroup(profileData: any) {
    const arrFieldGroupArr = [];
    this.submitForm.forEach(obj => {
      arrFieldGroupArr.push(obj.fieldGroup.fieldGrpName);
    });
    arrFieldGroupArr.forEach(groupName => {
      const arrGroup = this.commonService.getUniqueArrFromNestedObject(profileData, 'fieldGroup', 'fieldGrpName', groupName);
      if (arrGroup && arrGroup.length === 0) {
        const objToAdd = this.commonService.getUniqueArrFromNestedObject(this.submitForm, 'fieldGroup', 'fieldGrpName', groupName);
        profileData.push(objToAdd[0]);
      }
    });
    this.submitForm = [];
    this.submitForm = profileData;
  }

  submitConfiguredForm() {
    if (this.formData.businessType && this.formData.businessType.length > 0) {
      if (this.formData.editKPIFlag) {
        this.commonService.showErrorToaster(customMessages.errorMessageEditSave);
      } else {
        const saveForm = this.formatSubmitForm();
        if (this.formData.editFlag) {
          this.progressLoader(true), this.updateConfiguredFormSubscription = this.configureService.updateConfigurationForm(saveForm).subscribe((data: any) => {
            this.commonService.showSuccessToaster(customMessages.saveKPI);
            this.formData.editFlag = true;
            this.formatSubmitFormToView(saveForm.profileData);
            this.progressLoader(false);
          },
            err => {
              if(err && err.status == 406) {
                this.commonService.showErrorToaster(customMessages.errorMessageForExsistingKPIDeletion);
              } else {
                this.commonService.showErrorToaster(customMessages.errorMessage); 
              }
              this.formatSubmitFormToView(saveForm.profileData);
              this.progressLoader(false);
            });
        } else {
          this.progressLoader(true), this.submitConfiguredFormSubscription = this.configureService.saveConfigurationForm(saveForm).subscribe((data: any) => {
            this.commonService.showSuccessToaster(customMessages.saveKPI);
            this.formData.editFlag = true;
            this.formatSubmitFormToView(saveForm.profileData);
            this.progressLoader(false);
          },
            err => {
              this.commonService.showErrorToaster(customMessages.errorMessage);
              this.formatSubmitFormToView(saveForm.profileData);
              this.progressLoader(false);
            });
        }
      }
    } else {
      this.commonService.showErrorToaster(customMessages.errorMessageForBusinessType);
    }
  }

  deleteGroup() {
    if (this.deleteGroupData.grpId) {
      for (let i = 0; i < this.submitForm.length; i++) {
        if (this.submitForm[i].fieldGroup.fieldGrpId === this.deleteGroupData.grpId) {
          this.submitForm.splice(i, 1);
          i--;
        }
      }
    } else {
      this.commonService.showErrorToaster(customMessages.errorDeleteGroup);
    }
  }

  onPreview() {
    if (this.formData.businessType && this.formData.businessType.length > 0) {
      this.commonService.hideToaster();
      // tslint:disable-next-line: no-use-before-declare
      let dialogRef = this.dialog.open(DialogComponent, {
        width: '100vw',
        height: '100vh',
        maxWidth: '100vw',
        maxHeight: '100vh',
        hasBackdrop: false
      });
      const previewForm = this.formatSubmitForm();
      previewForm['isPerviewForm'] = true;
      this.elementInterarctionService.previewDetails.next(previewForm);
    } else {
      this.commonService.showErrorToaster(customMessages.errorMessageForBusinessType);
    }
  }

  ngOnDestroy() {
    this.getConfigurationSubscription && this.getConfigurationSubscription.unsubscribe();
    this.createGroupSubscription && this.createGroupSubscription.unsubscribe();
    this.getGroupValuesSubscription && this.getGroupValuesSubscription.unsubscribe();
    this.submitConfiguredFormSubscription && this.submitConfiguredFormSubscription.unsubscribe();
    this.updateConfiguredFormSubscription && this.updateConfiguredFormSubscription.unsubscribe();
    this.deleteGroupSubscription && this.deleteGroupSubscription.unsubscribe();
    this.getProspectProfileDetailsSubscription && this.getProspectProfileDetailsSubscription.unsubscribe();
  }
}

export interface Element {
  type: string;
  weightageVal: number;
}

export interface Validation {
  validationName: string;
  validationMsg: string;
  value: any;
}

@Component({
  selector: 'app-dialog-overview-example-dialog',
  templateUrl: 'preview.dialogbox.html',
})
export class DialogComponent {

  constructor( private elementInterarctionService: ElementInterarctionService,
               public dialogRef: MatDialogRef<DialogComponent>,
               @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    const previewForm = { isPerviewForm: false, profileName: '', profileData: [] };
    this.elementInterarctionService.previewDetails.next(previewForm);
    this.dialogRef.close();
  }
}

