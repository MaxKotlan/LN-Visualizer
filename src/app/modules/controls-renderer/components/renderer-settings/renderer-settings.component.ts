import { Component, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSliderChange } from '@angular/material/slider';
import { Store } from '@ngrx/store';
import {
    setNodeMotionIntensity,
    setNodeTimeIntensity,
    setRenderResolution,
    setShowAxis,
    setShowGraphAnimation,
    setShowGrid,
} from '../../actions';
import { RendererControlState } from '../../reducer';
import {
    selectNodeMotionIntensity,
    selectNodeTimeIntensity,
    selectRenderResolution,
    selectShowAxis,
    selectShowGraphAnimation,
    selectShowGrid,
} from '../../selectors';

@Component({
    selector: 'app-renderer-settings',
    templateUrl: './renderer-settings.component.html',
    styleUrls: ['./renderer-settings.component.scss'],
})
export class RendererSettingsComponent {
    constructor(private store$: Store<RendererControlState>) {}

    public showGrid$ = this.store$.select(selectShowGrid);
    public showAxis$ = this.store$.select(selectShowAxis);
    public showGraphAnimation$ = this.store$.select(selectShowGraphAnimation);
    public nodeMotionIntensity$ = this.store$.select(selectNodeMotionIntensity);
    public nodeTimeIntensity$ = this.store$.select(selectNodeTimeIntensity);
    public renderResolution$ = this.store$.select(selectRenderResolution);

    setShowGrid(event: MatCheckboxChange) {
        this.store$.dispatch(setShowGrid({ value: event.checked }));
    }

    setShowAxis(event: MatCheckboxChange) {
        this.store$.dispatch(setShowAxis({ value: event.checked }));
    }

    setShowGraphAnimation(event: MatCheckboxChange) {
        this.store$.dispatch(setShowGraphAnimation({ value: event.checked }));
    }

    setNodeMotionIntensity(event: MatSliderChange) {
        this.store$.dispatch(setNodeMotionIntensity({ value: event.value || 0.005 }));
    }
    setNodeTimeIntensity(event: MatSliderChange) {
        this.store$.dispatch(setNodeTimeIntensity({ value: event.value || 0.005 }));
    }

    setRenderResolution(event: MatSliderChange) {
        this.store$.dispatch(setRenderResolution({ value: event.value || 1.0 }));
    }
}
