import { Component, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Store } from '@ngrx/store';
import { setShowAxis, setShowGraphAnimation, setShowGrid } from '../../actions';
import { RendererControlState } from '../../reducer';
import { selectShowAxis, selectShowGraphAnimation, selectShowGrid } from '../../selectors';

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

    setShowGrid(event: MatCheckboxChange) {
        this.store$.dispatch(setShowGrid({ value: event.checked }));
    }

    setShowAxis(event: MatCheckboxChange) {
        this.store$.dispatch(setShowAxis({ value: event.checked }));
    }

    setShowGraphAnimation(event: MatCheckboxChange) {
        this.store$.dispatch(setShowGraphAnimation({ value: event.checked }));
    }
}
