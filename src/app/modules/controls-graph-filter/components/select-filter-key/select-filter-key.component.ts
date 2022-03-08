import { Component } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { GraphFilterState } from '../../reducer';
import * as filterSelectors from '../../selectors/filter.selectors';

@UntilDestroy()
@Component({
    selector: 'app-select-filter-key',
    templateUrl: './select-filter-key.component.html',
    styleUrls: ['./select-filter-key.component.scss'],
})
export class SelectFilterKeyComponent {
    constructor(private store$: Store<GraphFilterState>) {}

    public options$: Observable<string[]> = this.store$.select(filterSelectors.allowedFilterKeys);
    public operators$: Observable<string[]> = this.store$.select(filterSelectors.allowedOperators);
}
