import { TestBed } from '@angular/core/testing';

import { ChannelGeometryService } from './channel-geometry.service';

describe('ChannelGeometryService', () => {
  let service: ChannelGeometryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChannelGeometryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
