import { TestBed } from '@angular/core/testing';

import { CameraControllerService } from './camera-controller.service';

describe('CameraControllerService', () => {
  let service: CameraControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CameraControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
