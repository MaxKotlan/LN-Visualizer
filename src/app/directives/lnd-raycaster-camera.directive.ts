import {AfterViewInit, Directive} from '@angular/core';
import { AbstractCamera } from 'atft';
import { LndRaycasterService } from '../services/lnd-raycaster-service';

@Directive({selector: '[lnd-raycaster-camera]'})
export class LndRaycasterCameraDirective implements AfterViewInit {

  constructor(
    private host: AbstractCamera<any>,
    private raycasterService: LndRaycasterService
  ) {

  }

  ngAfterViewInit(): void {
    this.raycasterService.setCamera(this.host);
  }

}