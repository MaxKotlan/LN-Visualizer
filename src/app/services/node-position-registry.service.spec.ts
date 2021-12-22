import { TestBed } from '@angular/core/testing';

import { NodePositionRegistryService } from './node-position-registry.service';

describe('NodePositionRegistryService', () => {
  let service: NodePositionRegistryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NodePositionRegistryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
