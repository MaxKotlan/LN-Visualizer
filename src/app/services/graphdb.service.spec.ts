import { TestBed } from '@angular/core/testing';

import { GraphdbService } from './graphdb.service';

describe('GraphdbService', () => {
  let service: GraphdbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GraphdbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
