import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { displayUnits } from 'src/app/constants/display-units.constant';
import { setDisplayUnit } from '../../actions';
import { MiscControlState } from '../../reducers';
import { displayUnit } from '../../selectors/misc-controls.selectors';

@Component({
    selector: 'app-display-unit-selector',
    templateUrl: './display-unit-selector.component.html',
    styleUrls: ['./display-unit-selector.component.scss'],
})
export class DisplayUnitSelectorComponent {
    public displayUnits = displayUnits;

    constructor(private store: Store<MiscControlState>) {}

    public selectDisplayUnit$ = this.store.select(displayUnit);

    setDisplayUnit(event) {
        this.store.dispatch(setDisplayUnit({ value: event }));
    }
}
