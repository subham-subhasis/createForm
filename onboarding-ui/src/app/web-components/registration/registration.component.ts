import { Component, OnInit, ViewEncapsulation, Input, OnDestroy, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RegistrationService } from './registration.service';
import { ElementInterarctionService } from '../element-interaction-service/element-interarction-service';
import { Subscription } from 'rxjs';
import { customMessages } from 'src/app/common/utils/constants';
import { CommonService } from 'src/app/common/services/common.service';
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RegistrationComponent implements OnInit, OnDestroy, OnChanges {

  img1 = 'assets/images/static-content1.png';
  img2 = 'assets/images/static-content2.png';
  img3 = 'assets/images/static-content3.png';

  @Input() userid: number = 0;
  @Input() username: string;
  @Input() selectedProfile = '';
  profileData = [];
  profiles = [];
  formData = { message: '', confirmDialog: false };
  isConfirm = false;
  isRegistrationSuccess = false;
  showSpinner = false;
  isPreView = false;
  isClosable = false;
  @Input() previewDetails = {} as any;
  formGrpMap: { [key: string]: { controls: FormGroup, config: any, definitionIds: any } } = {};
  formGrpMapKeys = [];
  configurationJsonData = {} as any;

  previewDetailsSubsctiption: Subscription;
  registartionFormSubsctiption: Subscription;
  getProfilesSubscription: Subscription;
  constructor(private registrationService: RegistrationService,
              private elementInterarctionService: ElementInterarctionService,
              private commonService: CommonService) { 
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
    setTimeout(() => {
      let sessionUserId = sessionStorage.getItem('sessionUserData');
      this.userid = this.commonService.decryptData(sessionUserId);
      this.commonService.userId = this.userid;
      let sessionUserName = sessionStorage.getItem('sessionUserName');
      this.username = this.commonService.decryptData(sessionUserName);
      this.commonService.userName = this.username;
    });
    this.commonService.hideToaster();
    this.showSpinner = true;
    this.previewDetailsSubsctiption = this.elementInterarctionService.previewDetails.subscribe(resp => {
      this.showSpinner = false;
      this.profileData = resp.profileData;
      this.selectedProfile = resp.profileName;
      if (this.profileData && this.profileData.length) {
        this.isPreView = true;
        this.prepareFormGroup();
      } else {
        this.isPreView = false;
        this.initializeForm();
      }
    });
  }

  onModalClick(event: any) {
    if (event === 'close') {
      this.formData.confirmDialog = false;
    } else if (event === 'yes') {
      this.formData.confirmDialog = false;
    }
  }

  initializeForm() {
    this.showSpinner = true;
    this.registrationService.initializeRegistration()
      .subscribe(response => {
        this.showSpinner = false;
        this.profiles = response.profiles;
        if (response.profiles && response.profiles.length) {
          if (response.profiles.length === 1) {
            this.selectedProfile = response.singleProfileData[0].profileName;
            this.profileData = response.singleProfileData[0].profileData;
            this.prepareFormGroup();
          }
        }
      }, err => {
        this.showSpinner = false;
      });
  }

  isSwitchProfileRequired() {
    if (this.profiles && this.profiles.length > 1) {
      return true;
    } else {
      return false;
    }
  }

  prepareFormGroup() {
    this.profileData.sort((a, b) => {
      return a.groupOrder - b.groupOrder;
    });
    this.createFormGroups();
    this.formGrpMapKeys = Object.keys(this.formGrpMap);
  }

  onProfileSelection() {
    this.showSpinner = true;
    this.profileData = [];
    this.getProfilesSubscription = this.registrationService.getProfileInfo(this.selectedProfile)
      .subscribe(resp => {
        this.showSpinner = false;
        this.profileData = resp[0].profileData;
        this.prepareFormGroup();
      }, err => {
        this.showSpinner = false;
        alert('Some Error Occured');
      });
  }

  createFormGroups() {
    if (this.profileData && this.profileData.length) {
      this.formGrpMap = {};
      this.profileData.forEach(groupItem => {
        if (groupItem && groupItem.fieldGroup && groupItem.fieldGroup.fieldGrpName && !this.formGrpMap[groupItem.fieldGroup.fieldGrpName]) {
          this.formGrpMap[groupItem.fieldGroup.fieldGrpName] = {} as any;
          this.formGrpMap[groupItem.fieldGroup.fieldGrpName].controls = this.registrationService.getGroupsFormControls(groupItem.definitions);
          this.formGrpMap[groupItem.fieldGroup.fieldGrpName].config = this.registrationService.getGroupsFormConfig(groupItem.definitions);
          this.formGrpMap[groupItem.fieldGroup.fieldGrpName].definitionIds = this.registrationService.getDefinitionsIds(groupItem.definitions);
        } else {
          this.formGrpMap[groupItem.fieldGroup.fieldGrpName].controls = this.registrationService.getGroupsFormControls(groupItem.definitions);
          this.formGrpMap[groupItem.fieldGroup.fieldGrpName].config = this.registrationService.getGroupsFormConfig(groupItem.definitions);
          this.formGrpMap[groupItem.fieldGroup.fieldGrpName].definitionIds = this.registrationService.getDefinitionsIds(groupItem.definitions);
        }
      });
    }
  }



  onSave() {
    this.showSpinner = true;
    let isValid = true;
    const partnerRequest = {} as any;
    // // tslint:disable-next-line: forin
    partnerRequest.profileName = this.selectedProfile;
    partnerRequest.infoData = [];
    // tslint:disable-next-line: forin
    for (const key in this.formGrpMap) {
      const group = this.formGrpMap[key];
      this.registrationService.validateAllFormFields(group.controls);
      const mappedArray = this.registrationService.mapFormGroupToCreatePartnerRequest(group.controls.getRawValue(), group.definitionIds);
      partnerRequest.infoData = [...partnerRequest.infoData, ...mappedArray];
      if (group.controls.status.toLowerCase() === 'invalid') {
        isValid = false;
      }
    }
    if (!isValid) {
      this.commonService.showErrorToaster(customMessages.manadateMessage);
      this.showSpinner = false;
      return;
    }
    this.registartionFormSubsctiption = this.registrationService.saveRegistration(partnerRequest).subscribe(resp => {
      this.showSpinner = false;
      this.formData.confirmDialog = true;
      if (resp.Status.toLowerCase() === 'success') {
        this.formData.message = customMessages.saveSuccessWithValidEmailRegistartionForm;
        this.onReset();
      } else if (resp.Status.toLowerCase() === 'invalidmailid' || resp.Status.toLowerCase() === 'emailservicedown') {
        this.formData.message = customMessages.saveSuccessWithOutValidEmailRegistartionForm;
        this.onReset();
      } else {
        this.formData.message = customMessages.saveFailedRegistartionForm;
      }
    }, (err) => {
      this.showSpinner = false;
      this.formData.confirmDialog = true;
      this.formData.message = customMessages.saveFailedRegistartionForm;
      if (err && err.error && err.error.Status && err.error.Status.length > 0) {
        this.formData.message = customMessages.saveFailedRegistartionForm + ' ' + err.error.Status;
      }
    });
  }

  onReset() {
    this.createFormGroups();
  }

  changedPlanData(event) {

  }

  ngOnDestroy() {
    this.commonService.hideToaster();
    this.previewDetailsSubsctiption && this.previewDetailsSubsctiption.unsubscribe();
    this.registartionFormSubsctiption && this.registartionFormSubsctiption.unsubscribe();
    this.getProfilesSubscription && this.getProfilesSubscription.unsubscribe();
  }

}
