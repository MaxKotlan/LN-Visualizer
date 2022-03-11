import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { GraphFilterState } from '../../reducer';
import * as filterSelectors from '../../selectors/filter.selectors';
import { Filter } from '../../types/filter.interface';
import * as filterActions from '../../actions';

@Component({
    selector: 'app-filter-list',
    templateUrl: './filter-list.component.html',
    styleUrls: ['./filter-list.component.scss'],
})
export class FilterListComponent {
    constructor(private store$: Store<GraphFilterState>) {}

    public filterList$: Observable<Filter[]> = this.store$.select(filterSelectors.activeFilters);

    public remove(filter: Filter) {
        this.store$.dispatch(
            filterActions.removeFilter({
                value: filter,
            }),
        );
    }
}
