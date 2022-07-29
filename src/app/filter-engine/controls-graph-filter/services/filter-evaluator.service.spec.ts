import { TestBed } from '@angular/core/testing';

import { FilterEvaluatorService } from './filter-evaluator.service';

describe('FilterEvaluatorService', () => {
  let service: FilterEvaluatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterEvaluatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
