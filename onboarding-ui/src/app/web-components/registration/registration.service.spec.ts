import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RegistrationService } from './registration.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DefaultService } from 'onboarding-api';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('RegistrationService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, FormsModule, ReactiveFormsModule],
        providers: [FormBuilder, DefaultService]
    }));

    it('should be created', () => {
        const service: RegistrationService = TestBed.get(RegistrationService);
        expect(service).toBeTruthy();
    });
});
