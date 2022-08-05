import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { setColorRangeMinMax } from '../../actions';
import { selectColorRangeMinMax } from '../../selectors';

@Component({
    selector: 'app-color-range-min-max-selector',
    templateUrl: './color-range-min-max-selector.component.html',
    styleUrls: ['./color-range-min-max-selector.component.scss'],
})
export class ColorRangeMinMaxSelectorComponent {
    options = [
        {
            label: 'Global Min/Max',
            value: 'global',
        },
        { label: 'Filtered Min/Max', value: 'filtered' },
    ];

    constructor(private store$: Store) {}

    public channelWidthProperty$ = this.store$.select(selectColorRangeMinMax);

    valueChanged(event) {
        this.store$.dispatch(setColorRangeMinMax({ value: event }));
    }
}
