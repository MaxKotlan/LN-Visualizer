import { TestBed } from '@angular/core/testing';

import { NodeSizeOffsetService } from './node-size-offset.service';

describe('NodeSizeOffsetService', () => {
  let service: NodeSizeOffsetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NodeSizeOffsetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
