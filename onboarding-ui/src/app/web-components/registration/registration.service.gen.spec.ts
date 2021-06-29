// import { TestBed } from '@angular/core/testing';
// import {
//   HttpClientTestingModule,
//   HttpTestingController
// } from '@angular/common/http/testing';
// import { FormGroup } from '@angular/forms';
// import { FormBuilder } from '@angular/forms';
// import { DefaultService } from 'onboarding-api';
// import { RegistrationService } from './registration.service';
// describe('RegistrationService', () => {
//   let service: RegistrationService;
//   beforeEach(() => {
//     const formGroupStub = () => ({
//       controls: {},
//       get: field => ({ markAsTouched: () => ({}) })
//     });
//     const formBuilderStub = () => ({
//       group: object => ({ addControl: () => ({}) }),
//       control: (string, validatorsArray) => ({})
//     });
//     const defaultServiceStub = () => ({ getprofileinfos: profileName => ({}) });
//     TestBed.configureTestingModule({
//       imports: [HttpClientTestingModule],
//       providers: [
//         RegistrationService,
//         { provide: FormGroup, useFactory: formGroupStub },
//         { provide: FormBuilder, useFactory: formBuilderStub },
//         { provide: DefaultService, useFactory: defaultServiceStub }
//       ]
//     });
//     service = TestBed.get(RegistrationService);
//   });
//   it('can load instance', () => {
//     expect(service).toBeTruthy();
//   });
//   describe('validateAllFormFields', () => {
//     it('makes expected calls', () => {
//       const formGroupStub: FormGroup = TestBed.get(FormGroup);
//       spyOn(formGroupStub, 'get').and.callThrough();
//       service.validateAllFormFields(formGroupStub);
//       expect(formGroupStub.get).toHaveBeenCalled();
//     });
//   });
//   describe('initializeRegistration', () => {
//     it('makes expected calls', () => {
//       const obj = {} as any;
//       const httpTestingController = TestBed.get(HttpTestingController);
//       spyOn(service, 'getStubProfiles').and.callThrough();
//       spyOn(service, 'getProfileInfo').and.callThrough();
//       service.initializeRegistration().subscribe(res => {
//         expect(res).toEqual(obj);
//       });
//       expect(service.getStubProfiles).toHaveBeenCalled();
//       expect(service.getProfileInfo).toHaveBeenCalled();
//       const req = httpTestingController.expectOne(
//         'assets/json/profilesData.json'
//       );
//       expect(req.request.method).toEqual('GET');
//       req.flush();
//       httpTestingController.verify();
//     });
//   });
// });
