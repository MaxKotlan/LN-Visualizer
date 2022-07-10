import { TestBed } from '@angular/core/testing';

import { NodePositionOffsetService } from './node-position-offset.service';

describe('NodePositionOffsetService', () => {
  let service: NodePositionOffsetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NodePositionOffsetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
