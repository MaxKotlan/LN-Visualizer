import { TestBed } from '@angular/core/testing';

import { ChannelRegistryService } from './channel-registry.service';

describe('ChannelRegistryService', () => {
  let service: ChannelRegistryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChannelRegistryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
