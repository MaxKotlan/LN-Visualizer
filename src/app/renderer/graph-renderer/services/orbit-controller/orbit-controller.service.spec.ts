import { TestBed } from '@angular/core/testing';

import { OrbitControllerService } from './orbit-controller.service';

describe('OrbitControllerService', () => {
  let service: OrbitControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrbitControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
