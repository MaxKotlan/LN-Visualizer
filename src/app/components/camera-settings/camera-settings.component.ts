import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { MatSliderChange } from '@angular/material/slider';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { setCameraFocusMode, setCameraFov } from 'src/app/actions/controls.actions';
import { cameraFocusMode } from 'src/app/constants/camera-focusmode.constant';
import { ControlsState } from 'src/app/reducers/controls.reducer';
import { selectCameraFocusMode, selectCameraFov } from 'src/app/selectors/controls.selectors';

@Component({
    selector: 'app-camera-settings',
    templateUrl: './camera-settings.component.html',
    styleUrls: ['./camera-settings.component.scss'],
})
export class CameraSettingsComponent {
    constructor(private store: Store<ControlsState>) {}

    public cameraFocusModeList = cameraFocusMode;

    public selectCameraFov$ = this.store.select(selectCameraFov);
    public selectCameraFocusMode$ = this.store.select(selectCameraFocusMode);
    //.pipe(map((focusmode) => cameraFocusMode[focusmode]));

    setCameraFov(event: MatSliderChange) {
        this.store.dispatch(setCameraFov({ value: event.value || 60 }));
    }

    setCameraFocusMode(event: MatSelectChange) {
        if (event?.value === undefined) return;
        console.log(event);
        this.store.dispatch(setCameraFocusMode({ value: event.value }));
    }
}
