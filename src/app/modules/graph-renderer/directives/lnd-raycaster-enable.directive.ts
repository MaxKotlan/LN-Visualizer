import { AfterViewInit, Directive } from '@angular/core';
import { LndRaycasterService } from '../services/lnd-raycaster-service/lnd-raycaster-service';

// eslint-disable-next-line @angular-eslint/directive-selector
@Directive({ selector: '[lnd-raycaster-enable]' })
export class LndRaycasterEnableDirective implements AfterViewInit {
    constructor(private raycasterService: LndRaycasterService) {}

    ngAfterViewInit(): void {
        this.raycasterService.enable();
    }
}
