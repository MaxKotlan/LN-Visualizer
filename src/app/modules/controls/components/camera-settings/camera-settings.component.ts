import { Component } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { MatSliderChange } from '@angular/material/slider';
import { Store } from '@ngrx/store';
import { cameraFocusMode } from 'src/app/constants/camera-focusmode.constant';
import { ControlsState } from 'src/app/modules/controls/reducers/controls.reducer';
import {
    selectCameraFocusMode,
    selectCameraFov,
} from 'src/app/modules/controls/selectors/controls.selectors';
import { setCameraFocusMode, setCameraFov } from '../../actions';

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
