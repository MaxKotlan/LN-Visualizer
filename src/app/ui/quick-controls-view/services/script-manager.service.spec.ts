import { TestBed } from '@angular/core/testing';

import { ScriptManagerService } from './script-manager.service';

describe('ScriptManagerService', () => {
  let service: ScriptManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScriptManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
