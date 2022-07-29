import { TestBed } from '@angular/core/testing';

import { PilotFlagApiService } from './pilot-flag-api.service';

describe('PilotFlagApiService', () => {
  let service: PilotFlagApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PilotFlagApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
