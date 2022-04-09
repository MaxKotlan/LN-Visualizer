import { TestBed } from '@angular/core/testing';

import { NodeBuffersService } from './node-buffers.service';

describe('NodeBuffersService', () => {
  let service: NodeBuffersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NodeBuffersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
