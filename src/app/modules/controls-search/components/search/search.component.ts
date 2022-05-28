import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, Subject } from 'rxjs';
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
    public optionSelected$ = new Subject<void>();

    public nodeSearchResults$ = this.nodeSearchEffects.selectNodesSearchResults$;
    public selectSearchString$ = this.nodeSearchEffects.selectFinalMatchAliasFromSearch$.pipe(
        filter(() => this.shouldUpdateSearchText),
    );

    clear() {
        this.store$.dispatch(searchGraph({ searchText: '' }));
    }

    public shouldUpdateSearchText = false;

    onTextChange(event: any) {
        if (!!event?.target?.value || event?.target?.value === '') {
            this.shouldUpdateSearchText = false;
            this.store$.dispatch(searchGraph({ searchText: event.target.value }));
        }
    }

    onOptionSelected(event: any) {
        if (event?.option?.value) {
            this.shouldUpdateSearchText = true;
            this.optionSelected$.next();
            console.log(event.option);
            this.store$.dispatch(searchGraph({ searchText: event.option.value }));
        }
    }
}
