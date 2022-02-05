import { Component, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSliderChange } from '@angular/material/slider';
import { Store } from '@ngrx/store';
import {
    renderLabels,
    renderNodes,
    setNodeSize,
    setPointAttenuation,
    setPointUseIcon,
} from 'src/app/actions/controls.actions';
import { ControlsState } from 'src/app/reducers/controls.reducer';
import {
    selectNodeSize,
    selectPointAttenuation,
    selectPointUseIcon,
    shouldRenderNodes,
} from 'src/app/selectors/controls.selectors';

@Component({
    selector: 'app-node-settings',
    templateUrl: './node-settings.component.html',
    styleUrls: ['./node-settings.component.scss'],
})
export class NodeSettingsComponent {
    constructor(private store: Store<ControlsState>) {}

    public selectNodeSize$ = this.store.select(selectNodeSize);
    public shouldRenderNodes$ = this.store.select(shouldRenderNodes);
    public selectPointAttenuation$ = this.store.select(selectPointAttenuation);
    public selectPointUseIcon$ = this.store.select(selectPointUseIcon);

    setNodeSize(event: MatSliderChange) {
        this.store.dispatch(setNodeSize({ nodeSize: event.value || 1 }));
    }

    setShouldRenderNodes(event: MatCheckboxChange) {
        this.store.dispatch(renderNodes({ value: event.checked }));
    }

    setShouldRenderLabels(event: MatCheckboxChange) {
        this.store.dispatch(renderLabels({ value: event.checked }));
    }

    setPointAttenuation(event: MatCheckboxChange) {
        this.store.dispatch(setPointAttenuation({ value: event.checked }));
    }

    setPointUseIcon(event: MatCheckboxChange) {
        this.store.dispatch(setPointUseIcon({ value: event.checked }));
    }
}
