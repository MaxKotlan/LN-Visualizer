import { TestBed } from '@angular/core/testing';

import { ChannelBuffersService } from './channel-buffers.service';

describe('ChannelBuffersService', () => {
  let service: ChannelBuffersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChannelBuffersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
