import { TestBed } from '@angular/core/testing';

import { NodeGeometryService } from './node-geometry.service';

describe('NodeGeometryService', () => {
  let service: NodeGeometryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NodeGeometryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
