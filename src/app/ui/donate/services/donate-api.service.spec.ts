import { TestBed } from '@angular/core/testing';

import { DonateApiService } from './donate-api.service';

describe('DonateApiService', () => {
  let service: DonateApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DonateApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
