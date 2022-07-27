import { Component } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { Store } from '@ngrx/store';
import { cameraFocusMode } from 'src/app/constants/camera-focusmode.constant';
import {
    selectCameraFocusMode,
    selectCameraFov,
} from 'src/app/ui/settings/controls/selectors/controls.selectors';
import { setCameraFocusMode, setCameraFov } from '../../actions';
import { GenericControlsState } from '../../reducers';

@Component({
    selector: 'app-camera-settings',
    templateUrl: './camera-settings.component.html',
    styleUrls: ['./camera-settings.component.scss'],
})
export class CameraSettingsComponent {
    constructor(private store: Store<GenericControlsState>) {}

    public cameraFocusModeList = cameraFocusMode;

    public selectCameraFov$ = this.store.select(selectCameraFov);
    public selectCameraFocusMode$ = this.store.select(selectCameraFocusMode);

    setCameraFov(event: MatSliderChange) {
        this.store.dispatch(setCameraFov({ value: event.value || 60 }));
    }

    setCameraFocusMode(event) {
        this.store.dispatch(setCameraFocusMode({ value: event }));
    }
}
