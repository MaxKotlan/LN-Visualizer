import { AfterViewInit, Directive } from '@angular/core';
import { LndRaycasterService } from '../services/lnd-raycaster-service';

@Directive({ selector: '[lnd-raycaster-enable]' })
export class LndRaycasterEnableDirective implements AfterViewInit {
  constructor(private raycasterService: LndRaycasterService) {}

  ngAfterViewInit(): void {
    this.raycasterService.enable();
  }
}
