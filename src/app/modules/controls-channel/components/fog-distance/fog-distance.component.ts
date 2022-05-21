import { Component } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { Store } from '@ngrx/store';
import { GenericControlsState } from 'src/app/modules/controls/reducers';
import { setFogDistance } from '../../actions';
import { selectFogDistance } from '../../selectors';

@Component({
    selector: 'app-fog-distance',
    templateUrl: './fog-distance.component.html',
    styleUrls: ['./fog-distance.component.scss'],
})
export class FogDistanceComponent {
    constructor(private store: Store<GenericControlsState>) {}

    public selectFogDistance$ = this.store.select(selectFogDistance);

    setFogDistance(event: MatSliderChange) {
        this.store.dispatch(setFogDistance({ value: event.value || 0.01 }));
    }
}
