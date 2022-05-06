import { Injectable } from '@angular/core';
import { OrbitControlsComponent } from 'atft';

@Injectable({
    providedIn: 'root',
})
export class OrbitControllerService {
    controls: OrbitControlsComponent;

    setOrbitControlsComponent(controls: OrbitControlsComponent) {
        this.controls = controls;
    }
}
