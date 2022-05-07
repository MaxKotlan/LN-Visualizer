import { TestBed } from '@angular/core/testing';

import { TreeDataServiceService } from './tree-data-service.service';

describe('TreeDataServiceService', () => {
  let service: TreeDataServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TreeDataServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
