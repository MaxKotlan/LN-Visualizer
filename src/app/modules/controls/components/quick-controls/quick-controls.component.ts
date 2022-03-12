import { Component } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSliderChange } from '@angular/material/slider';
import { Store } from '@ngrx/store';
import { searchGraph, sortOrderChange } from '../../actions';
import * as channelControlActions from '../../../controls-channel/actions';
import { ScreenSizeService } from 'src/app/services/screen-size.service';
import { GraphState } from 'src/app/modules/graph-renderer/reducer';
import {
    selectNodesSearchResults,
    selectFinalMatcheNodesFromSearch,
} from 'src/app/modules/graph-renderer/selectors';
import { renderNodes, gotoNode } from 'src/app/modules/controls-node/actions';
import { shouldRenderNodes } from 'src/app/modules/controls-node/selectors/node-controls.selectors';
import { shouldRenderEdges } from 'src/app/modules/controls-channel/selectors';
import { minEdgesRecompute, renderEdges } from 'src/app/modules/controls-channel/actions';

@Component({
    selector: 'app-quick-controls',
    templateUrl: './quick-controls.component.html',
    styleUrls: ['./quick-controls.component.scss'],
})
export class QuickControlsComponent {
    constructor(private store$: Store<GraphState>, public screenSizeService: ScreenSizeService) {}

    public nodeSearchResults$ = this.store$.select(selectNodesSearchResults);
    public shouldRenderEdges$ = this.store$.select(shouldRenderEdges);
    public shouldRenderNodes$ = this.store$.select(shouldRenderNodes);

    public selectFinalMatcheNodesFromSearch$ = this.store$.select(selectFinalMatcheNodesFromSearch);

    onTextChange(event: any) {
        if (event?.target?.value)
            this.store$.dispatch(searchGraph({ searchText: event.target.value }));
        if (event?.option?.value)
            this.store$.dispatch(searchGraph({ searchText: event.option.value }));
    }

    updateRenderNodes(event: MatCheckboxChange) {
        this.store$.dispatch(renderNodes({ value: event.checked }));
    }

    updateRenderEdges(event: MatCheckboxChange) {
        this.store$.dispatch(renderEdges({ value: event.checked }));
    }

    filterConnections(event: MatSliderChange) {
        this.store$.dispatch(minEdgesRecompute({ minEdges: event.value || 0 }));
    }

    connectionSortChanged(event: MatSlideToggleChange) {
        this.store$.dispatch(sortOrderChange({ ascending: event.checked }));
    }

    gotoNode() {
        this.store$.dispatch(gotoNode());
    }
}
