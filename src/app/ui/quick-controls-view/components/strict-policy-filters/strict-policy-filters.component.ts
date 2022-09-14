import { Component } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Store } from '@ngrx/store';
import { setStrictPolicyFilters } from 'src/app/ui/settings/controls-node/actions';
import { selectStrictPolicyFilters } from 'src/app/ui/settings/controls-node/selectors/node-controls.selectors';

@Component({
    selector: 'app-strict-policy-filters',
    templateUrl: './strict-policy-filters.component.html',
    styleUrls: ['./strict-policy-filters.component.scss'],
})
export class StrictPolicyFiltersComponent {
    constructor(private store$: Store) {}

    public isStrictPolicyEnabled$ = this.store$.select(selectStrictPolicyFilters);

    public updateStrictPolicyMode(event: MatSlideToggleChange) {
        this.store$.dispatch(setStrictPolicyFilters({ value: event.checked }));
    }
}
