import { TestBed } from '@angular/core/testing';

import { FeeColorService } from './fee-color.service';

describe('FeeColorService', () => {
  let service: FeeColorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeeColorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
