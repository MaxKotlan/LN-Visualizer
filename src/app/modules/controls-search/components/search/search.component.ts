import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, filter, map, Subject } from 'rxjs';
import { shouldUpdateSearchBar } from 'src/app/modules/controls/selectors/controls.selectors';
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
    public selectSearchString$ = combineLatest([
        this.nodeSearchEffects.selectFinalMatchAliasFromSearch$,
        this.store$.select(shouldUpdateSearchBar),
    ]).pipe(
        filter(([, shouldUpdateSearchBar]) => shouldUpdateSearchBar),
        map(([match]) => match),
    );

    clear() {
        this.store$.dispatch(searchGraph({ searchText: '', shouldUpdateSearchBar: true }));
    }

    public shouldUpdateSearchText = false;

    onTextChange(event: any) {
        if (!!event?.target?.value || event?.target?.value === '') {
            this.shouldUpdateSearchText = false;
            this.store$.dispatch(
                searchGraph({ searchText: event.target.value, shouldUpdateSearchBar: false }),
            );
        }
    }

    onOptionSelected(event: any) {
        if (event?.option?.value) {
            this.shouldUpdateSearchText = true;
            this.store$.dispatch(
                searchGraph({ searchText: event.option.value, shouldUpdateSearchBar: true }),
            );
        }
    }
}
