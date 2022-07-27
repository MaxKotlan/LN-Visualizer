import { TestBed } from '@angular/core/testing';

import { LightningNodeTextureService } from './lightning-node-texture.service';

describe('LightningNodeTextureService', () => {
  let service: LightningNodeTextureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LightningNodeTextureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
