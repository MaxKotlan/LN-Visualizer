import { TestBed } from '@angular/core/testing';

import { NodeRegistryService } from './node-registry.service';

describe('NodeRegistryService', () => {
  let service: NodeRegistryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NodeRegistryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
