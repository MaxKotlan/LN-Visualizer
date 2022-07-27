import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, filter, map, tap } from 'rxjs';
import { shouldUpdateSearchBar } from 'src/app/modules/controls/selectors/controls.selectors';
import { NodeSearchEffects } from 'src/app/renderer/graph-renderer/effects/node-search.effects';
import { GraphState } from 'src/app/renderer/graph-renderer/reducer';
import { searchGraph } from '../../../controls/actions';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
    constructor(private store$: Store<GraphState>, private nodeSearchEffects: NodeSearchEffects) {}

    public searchInitialized = false;

    public nodeSearchResults$ = this.nodeSearchEffects.selectNodesSearchResults$;
    public selectSearchString$ = combineLatest([
        this.nodeSearchEffects.selectFinalMatchAliasFromSearch$,
        this.store$.select(shouldUpdateSearchBar),
    ]).pipe(
        filter(([, shouldUpdateSearchBar]) => shouldUpdateSearchBar || !this.searchInitialized),
        tap(() => (this.searchInitialized = true)),
        map(([match]) => match),
    );

    clear() {
        this.store$.dispatch(searchGraph({ searchText: '', shouldUpdateSearchBar: false }));
    }

    onTextChange(event: any) {
        if (!!event?.target?.value || event?.target?.value === '') {
            this.store$.dispatch(
                searchGraph({ searchText: event.target.value, shouldUpdateSearchBar: false }),
            );
        }
    }

    onOptionSelected(event: any) {
        if (event?.option?.value) {
            this.store$.dispatch(
                searchGraph({ searchText: event.option.value, shouldUpdateSearchBar: true }),
            );
        }
    }
}
