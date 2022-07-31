import { TestBed } from '@angular/core/testing';

import { CapacityColorServiceService } from './capacity-color-service.service';

describe('CapacityColorServiceService', () => {
  let service: CapacityColorServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CapacityColorServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
