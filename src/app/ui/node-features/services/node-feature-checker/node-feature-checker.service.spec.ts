import { TestBed } from '@angular/core/testing';

import { NodeFeatureCheckerService } from './node-feature-checker.service';

describe('NodeFeatureCheckerService', () => {
  let service: NodeFeatureCheckerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NodeFeatureCheckerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
