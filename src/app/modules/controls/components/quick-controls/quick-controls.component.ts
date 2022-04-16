import { Component } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSliderChange } from '@angular/material/slider';
import { Store } from '@ngrx/store';
import { minEdgesRecompute, renderEdges } from 'src/app/modules/controls-channel/actions';
import { shouldRenderEdges } from 'src/app/modules/controls-channel/selectors';
import { renderNodes } from 'src/app/modules/controls-node/actions';
import { shouldRenderNodes } from 'src/app/modules/controls-node/selectors/node-controls.selectors';
import { GraphState } from 'src/app/modules/graph-renderer/reducer';
import { ScreenSizeService } from 'src/app/modules/screen-size/services';
import { searchGraph, sortOrderChange } from '../../actions';

@Component({
    selector: 'app-quick-controls',
    templateUrl: './quick-controls.component.html',
    styleUrls: ['./quick-controls.component.scss'],
})
export class QuickControlsComponent {
    constructor(private store$: Store<GraphState>, public screenSizeService: ScreenSizeService) {}

    public shouldRenderEdges$ = this.store$.select(shouldRenderEdges);
    public shouldRenderNodes$ = this.store$.select(shouldRenderNodes);

    onTextChange(event: any) {
        if (event?.target?.value)
            this.store$.dispatch(searchGraph({ searchText: event.target.value }));
        if (event?.option?.value)
            this.store$.dispatch(searchGraph({ searchText: event.option.value }));
    }

    updateRenderNodes(event: MatSlideToggleChange) {
        this.store$.dispatch(renderNodes({ value: event.checked }));
    }

    updateRenderEdges(event: MatSlideToggleChange) {
        this.store$.dispatch(renderEdges({ value: event.checked }));
    }

    filterConnections(event: MatSliderChange) {
        this.store$.dispatch(minEdgesRecompute({ minEdges: event.value || 0 }));
    }

    connectionSortChanged(event: MatSlideToggleChange) {
        this.store$.dispatch(sortOrderChange({ ascending: event.checked }));
    }
}
