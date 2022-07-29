import { TestBed } from '@angular/core/testing';

import { ChannelColorService } from './channel-color.service';

describe('ChannelColorService', () => {
  let service: ChannelColorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChannelColorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
