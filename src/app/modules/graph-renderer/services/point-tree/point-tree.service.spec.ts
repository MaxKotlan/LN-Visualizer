import { TestBed } from '@angular/core/testing';

import { PointTreeService } from './point-tree.service';

describe('PointTreeService', () => {
  let service: PointTreeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PointTreeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
