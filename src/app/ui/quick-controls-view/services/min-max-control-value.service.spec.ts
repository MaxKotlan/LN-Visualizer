import { TestBed } from '@angular/core/testing';

import { MinMaxControlValueService } from './min-max-control-value.service';

describe('MinMaxControlValueService', () => {
  let service: MinMaxControlValueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MinMaxControlValueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
