import { TestBed } from '@angular/core/testing';

import { SetPasswordService } from './set-password.service';

describe('SetPasswordService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SetPasswordService = TestBed.get(SetPasswordService);
    expect(service).toBeTruthy();
  });
});
