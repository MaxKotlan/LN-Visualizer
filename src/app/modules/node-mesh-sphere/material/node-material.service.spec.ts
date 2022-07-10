import { TestBed } from '@angular/core/testing';

import { NodeMaterialService } from './node-material.service';

describe('NodeMaterialService', () => {
  let service: NodeMaterialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NodeMaterialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
