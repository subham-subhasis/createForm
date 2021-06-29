import { TestBed } from '@angular/core/testing';

import { AlertbarService } from './alertbar.service';

describe('AlertbarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AlertbarService = TestBed.get(AlertbarService);
    expect(service).toBeTruthy();
  });
});
