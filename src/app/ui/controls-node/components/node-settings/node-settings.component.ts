import { Component } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSliderChange } from '@angular/material/slider';
import { Store } from '@ngrx/store';
import { renderLabels } from 'src/app/ui/controls/actions';
import { GenericControlsState } from 'src/app/ui/controls/reducers';
import {
    renderNodes,
    setMinimumNodeSize,
    setNodeSize,
    setPointAttenuation,
    setPointUseIcon,
    setUniformNodeSize,
} from '../../actions';
import {
    selectMinimumNodeSize,
    selectNodeSize,
    selectPointAttenuation,
    selectPointUseIcon,
    selectUniformNodeSize,
    shouldRenderNodes,
} from '../../selectors/node-controls.selectors';

@Component({
    selector: 'app-node-settings',
    templateUrl: './node-settings.component.html',
    styleUrls: ['./node-settings.component.scss'],
})
export class NodeSettingsComponent {
    constructor(private store: Store<GenericControlsState>) {}

    public selectNodeSize$ = this.store.select(selectNodeSize);
    public selectNodeMinSize$ = this.store.select(selectMinimumNodeSize);
    public shouldRenderNodes$ = this.store.select(shouldRenderNodes);
    public selectPointAttenuation$ = this.store.select(selectPointAttenuation);
    public selectPointUseIcon$ = this.store.select(selectPointUseIcon);
    public selectUniformNodeSize$ = this.store.select(selectUniformNodeSize);

    setNodeSize(event: MatSliderChange) {
        this.store.dispatch(setNodeSize({ nodeSize: event.value || 1 }));
    }

    setNodeMinSize(event: MatSliderChange) {
        this.store.dispatch(setMinimumNodeSize({ nodeSize: event.value || 0.01 }));
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

    setUniformSize(event: MatCheckboxChange) {
        this.store.dispatch(setUniformNodeSize({ value: event.checked }));
    }
}
