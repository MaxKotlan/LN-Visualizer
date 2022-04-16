import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { NodeSearchEffects } from 'src/app/modules/graph-renderer/effects/node-search.effects';
import { GraphState } from 'src/app/modules/graph-renderer/reducer';
import { searchGraph } from '../../../controls/actions';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
    constructor(private store$: Store<GraphState>, private nodeSearchEffects: NodeSearchEffects) {}

    public nodeSearchResults$ = this.nodeSearchEffects.selectNodesSearchResults$;
    public selectSearchString$ = this.nodeSearchEffects.selectFinalMatchAliasFromSearch$;

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
