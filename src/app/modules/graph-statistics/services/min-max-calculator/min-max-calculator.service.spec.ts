import { TestBed } from '@angular/core/testing';

import { MinMaxCalculatorService } from './min-max-calculator.service';

describe('MinMaxCalculatorService', () => {
  let service: MinMaxCalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MinMaxCalculatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
