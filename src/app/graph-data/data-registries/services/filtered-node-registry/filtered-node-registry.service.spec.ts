import { TestBed } from '@angular/core/testing';

import { FilteredNodeRegistryService } from './filtered-node-registry.service';

describe('FilteredNodeRegistryService', () => {
  let service: FilteredNodeRegistryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilteredNodeRegistryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
