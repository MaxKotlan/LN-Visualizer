import { AfterViewInit, Directive } from '@angular/core';
import { AbstractCamera } from 'atft';
import { LndRaycasterService } from '../services/lnd-raycaster-service/lnd-raycaster-service';

// eslint-disable-next-line @angular-eslint/directive-selector
@Directive({ selector: '[lnd-raycaster-camera]' })
export class LndRaycasterCameraDirective implements AfterViewInit {
    constructor(private host: AbstractCamera<any>, private raycasterService: LndRaycasterService) {}

    ngAfterViewInit(): void {
        this.raycasterService.setCamera(this.host);
    }
}
