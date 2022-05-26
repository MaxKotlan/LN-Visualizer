import { TestBed } from '@angular/core/testing';

import { UnitConverterServiceService } from './unit-converter-service.service';

describe('UnitConverterServiceService', () => {
  let service: UnitConverterServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnitConverterServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
