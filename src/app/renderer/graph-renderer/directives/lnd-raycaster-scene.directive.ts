import { AfterViewInit, Directive, ElementRef } from '@angular/core';
import { LndRaycasterService } from '../services/lnd-raycaster-service/lnd-raycaster-service';

// eslint-disable-next-line @angular-eslint/directive-selector
@Directive({ selector: '[lnd-raycaster-scene]' })
export class LndRaycasterSceneDirective implements AfterViewInit {
    constructor(private elRef: ElementRef, private raycasterService: LndRaycasterService) {}
    ngAfterViewInit(): void {
        this.raycasterService.setCanvasObject(this.elRef);
    }
}
