import { Component, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Store } from '@ngrx/store';
import { setShowAxis, setShowGrid } from '../../actions';
import { RendererControlState } from '../../reducer';
import { selectShowAxis, selectShowGrid } from '../../selectors';

@Component({
    selector: 'app-renderer-settings',
    templateUrl: './renderer-settings.component.html',
    styleUrls: ['./renderer-settings.component.scss'],
})
export class RendererSettingsComponent {
    constructor(private store$: Store<RendererControlState>) {}

    public showGrid$ = this.store$.select(selectShowGrid);
    public showAxis$ = this.store$.select(selectShowAxis);

    setShowGrid(event: MatCheckboxChange) {
        this.store$.dispatch(setShowGrid({ value: event.checked }));
    }

    setShowAxis(event: MatCheckboxChange) {
        this.store$.dispatch(setShowAxis({ value: event.checked }));
    }
}
