import { TestBed } from '@angular/core/testing';

import { ChannelMaterialService } from './channel-material.service';

describe('ChannelMaterialService', () => {
  let service: ChannelMaterialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChannelMaterialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
