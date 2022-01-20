import { TestBed } from '@angular/core/testing';

import { LndApiServiceService } from './lnd-api-service.service';

describe('LndApiServiceService', () => {
    let service: LndApiServiceService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LndApiServiceService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
