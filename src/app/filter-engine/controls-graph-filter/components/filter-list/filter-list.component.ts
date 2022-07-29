import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { GraphFilterState } from '../../reducer';
import {
    ChannelEvaluationFunction,
    Filter,
    NodeEvaluationFunction,
} from '../../types/filter.interface';
import * as filterActions from '../../actions';

@Component({
    selector: 'app-filter-list',
    templateUrl: './filter-list.component.html',
    styleUrls: ['./filter-list.component.scss'],
})
export class FilterListComponent {
    constructor(private store$: Store<GraphFilterState>) {}

    @Input() filterList: Filter<NodeEvaluationFunction | ChannelEvaluationFunction>[];

    public remove(filter: Filter<NodeEvaluationFunction | ChannelEvaluationFunction>) {
        this.store$.dispatch(
            filterActions.removeChannelFilter({
                value: filter,
            }),
        );
    }
}
