import { TestBed } from '@angular/core/testing';

import { ElementInterarctionService } from './element-interarction-service';

describe('ElementInterarctionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ElementInterarctionService = TestBed.get(ElementInterarctionService);
    expect(service).toBeTruthy();
  });
});
