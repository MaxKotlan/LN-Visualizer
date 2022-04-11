import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { GraphState } from 'src/app/modules/graph-renderer/reducer';
import {
    selectNodesSearchResults,
    selectFinalMatchAliasFromSearch,
} from 'src/app/modules/graph-renderer/selectors';
import { searchGraph } from '../../actions/controls.actions';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
    constructor(private store$: Store<GraphState>) {}

    public nodeSearchResults$ = this.store$.select(selectNodesSearchResults);
    public selectSearchString$ = this.store$.select(selectFinalMatchAliasFromSearch);

    clear() {
        this.store$.dispatch(searchGraph({ searchText: '' }));
    }

    onTextChange(event: any) {
        if (!!event?.target?.value || event?.target?.value === '')
            this.store$.dispatch(searchGraph({ searchText: event.target.value }));
    }

    onOptionSelected(event: any) {
        if (event?.option?.value) {
            this.store$.dispatch(searchGraph({ searchText: event.option.value }));
        }
    }
}
