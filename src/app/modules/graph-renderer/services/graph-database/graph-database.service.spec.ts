import { TestBed } from '@angular/core/testing';

import { GraphDatabaseService } from './graph-database.service';

describe('GraphDatabaseService', () => {
  let service: GraphDatabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GraphDatabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
