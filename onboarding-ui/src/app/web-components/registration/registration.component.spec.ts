import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrationService } from './registration.service';
import { RegistrationComponent } from './registration.component';
import { MaterialModule } from 'src/app/material.module';
import { DynamicFormModule, DynamicFormComponent, DynamicFormService } from 'dynamic-form';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TranslateTestingModule } from './translateTesting.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';


describe('RegistrationComponent', () => {
    let component: RegistrationComponent;
    let fixture: ComponentFixture<RegistrationComponent>;
    const Profiles = [{ profileName: 'STUB' }];
    const profdata = [
        {
            profileName: 'STUB',
            profileData: [
                {
                    fieldGroup: {
                        fieldGrpId: 1,
                        fieldGrpName: 'Basic Details'
                    },
                    groupOrder: 1,
                    definitions: [
                        {
                            dfnName: 'First Name',
                            dfnId: 257,
                            dfnCategory: 'U',
                            fieldGrpId: null,
                            isMandatory: true,
                            mandatoryMsg: 'This Field is Mandatory',
                            action: 'publish',
                            maxWeightage: -1,
                            dfnOrder: 2,
                            fieldType: 'input',
                            fieldOptions: null,
                            isWebScrap: null,
                            weightages: [],
                            profileName: 'MVNO - Network Slicing',
                            validations: [
                                {
                                    validationName: 'required',
                                    validationMsg: 'This Field is Mandatory',
                                    value: null
                                },
                                {
                                    validationName: 'minlength',
                                    validationMsg: 'Length must be at least 10 characters',
                                    value: 10
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ];
    beforeEach(async(() => {
        const registrationServiceStub = () => ({
            initializeRegistration() {
                return of({ profiles: Profiles, singleProfileData: profdata });
            },
            getProfileInfo: selectedProfile => ({ subscribe: f => f({}) }),
            getGroupsFormControls: definitions => ({}),
            getGroupsFormConfig: definitions => ({}),
            getDefinitionsIds: definitions => ({}),
            validateAllFormFields: controls => ({}),
            mapFormGroupToCreatePartnerRequest: (value, definitionIds) => ({}),
            saveRegistration: partnerRequest => ({ subscribe: f => f({}) })
        });
        TestBed.configureTestingModule({
            imports: [
                MaterialModule,
                DynamicFormModule,
                FormsModule,
                ReactiveFormsModule,
                HttpClientTestingModule,
                TranslateTestingModule,
                BrowserAnimationsModule
            ],
            declarations: [
                RegistrationComponent
            ],
            providers: [
                { provide: RegistrationService, useFactory: registrationServiceStub },
            ],
            schemas: [
                CUSTOM_ELEMENTS_SCHEMA
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RegistrationComponent);
        component = fixture.componentInstance;
        component.profiles = undefined;
        fixture.detectChanges();
    });

    it('Show Spinner by default to be false', () => {
        expect(component.showSpinner).toBeFalsy();
    });
    it('profiles by  default  to be undefined', () => {
        expect(component.profiles).toBeUndefined();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
    // describe('initializeForm', () => {
    //     it('makes expected calls', () => {
    //         const registrationServiceStub: RegistrationService = fixture.debugElement.injector.get(
    //             RegistrationService
    //         );
    //         spyOn(component, 'prepareFormGroup').and.callThrough();
    //         spyOn(
    //             registrationServiceStub,
    //             'initializeRegistration'
    //         ).and.callThrough();
    //         component.initializeForm();
    //         expect(component.prepareFormGroup).toHaveBeenCalled();
    //         expect(registrationServiceStub.initializeRegistration).toHaveBeenCalled();
    //     });
    // });

});
