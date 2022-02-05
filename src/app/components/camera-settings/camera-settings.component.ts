import { Component, OnInit } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { Store } from '@ngrx/store';
import { setCameraFov } from 'src/app/actions/controls.actions';
import { ControlsState } from 'src/app/reducers/controls.reducer';
import { selectCameraFov } from 'src/app/selectors/controls.selectors';

@Component({
    selector: 'app-camera-settings',
    templateUrl: './camera-settings.component.html',
    styleUrls: ['./camera-settings.component.scss'],
})
export class CameraSettingsComponent {
    constructor(private store: Store<ControlsState>) {}
    public selectCameraFov$ = this.store.select(selectCameraFov);

    setCameraFov(event: MatSliderChange) {
        this.store.dispatch(setCameraFov({ value: event.value || 60 }));
    }
}
