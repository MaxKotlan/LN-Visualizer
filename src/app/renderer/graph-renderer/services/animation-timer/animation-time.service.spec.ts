import { TestBed } from '@angular/core/testing';

import { AnimationTimeService } from './animation-time.service';

describe('AnimationTimeService', () => {
  let service: AnimationTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnimationTimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
