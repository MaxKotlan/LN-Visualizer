import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { gotoNode } from 'src/app/ui/controls-node/actions';
import { NodeSearchEffects } from 'src/app/renderer/graph-renderer/effects/node-search.effects';
import { GraphState } from 'src/app/renderer/graph-renderer/reducer';

@Component({
    selector: 'app-search-and-go',
    templateUrl: './search-and-go.component.html',
    styleUrls: ['./search-and-go.component.scss'],
})
export class SearchAndGoComponent {
    constructor(private store$: Store<GraphState>, private nodeSearchEffects: NodeSearchEffects) {}

    public selectFinalMatcheNodesFromSearch$ =
        this.nodeSearchEffects.selectFinalMatcheNodesFromSearch$;

    gotoNode() {
        this.store$.dispatch(gotoNode());
    }
}
