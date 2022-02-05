import { Component, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSliderChange } from '@angular/material/slider';
import { Store } from '@ngrx/store';
import {
    renderEdges,
    renderLabels,
    renderNodes,
    resetControlsToDefault,
    setCameraFov,
    setEdgeUseDepthTest,
    setEdgeUseDottedLine,
    setNodeSize,
    setPointAttenuation,
    setPointUseIcon,
} from 'src/app/actions/controls.actions';
import { ControlsState } from 'src/app/reducers/controls.reducer';
import {
    selectCameraFov,
    selectEdgeDepthTest,
    selectEdgeDottedLine,
    selectNodeSize,
    selectPointAttenuation,
    selectPointUseIcon,
    shouldRenderEdges,
    shouldRenderLabels,
    shouldRenderNodes,
} from 'src/app/selectors/controls.selectors';

@Component({
    selector: 'app-settings-modal',
    templateUrl: './settings-modal.component.html',
    styleUrls: ['./settings-modal.component.scss'],
})
export class SettingsModalComponent {
    constructor(
        public dialogRef: MatDialogRef<SettingsModalComponent>,
        private store$: Store<ControlsState>,
    ) {}

    public shouldRenderLabels$ = this.store$.select(shouldRenderLabels);
    public selectCameraFov$ = this.store$.select(selectCameraFov);

    resetSettingsToDefault() {
        this.store$.dispatch(resetControlsToDefault());
    }

    setCameraFov(event: MatSliderChange) {
        this.store$.dispatch(setCameraFov({ value: event.value || 60 }));
    }
}
