import { Component } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Store } from '@ngrx/store';
import { renderEdges } from 'src/app/modules/controls-channel/actions';
import { shouldRenderEdges } from 'src/app/modules/controls-channel/selectors';
import { renderNodes } from 'src/app/modules/controls-node/actions';
import { shouldRenderNodes } from 'src/app/modules/controls-node/selectors/node-controls.selectors';
import { GraphState } from 'src/app/renderer/graph-renderer/reducer';
import { ScreenSizeService } from 'src/app/modules/screen-size/services';

@Component({
    selector: 'app-quick-controls',
    templateUrl: './quick-controls.component.html',
    styleUrls: ['./quick-controls.component.scss'],
})
export class QuickControlsComponent {
    constructor(private store$: Store<GraphState>, public screenSizeService: ScreenSizeService) {}

    public shouldRenderEdges$ = this.store$.select(shouldRenderEdges);
    public shouldRenderNodes$ = this.store$.select(shouldRenderNodes);

    updateRenderNodes(event: MatSlideToggleChange) {
        this.store$.dispatch(renderNodes({ value: event.checked }));
    }

    updateRenderEdges(event: MatSlideToggleChange) {
        this.store$.dispatch(renderEdges({ value: event.checked }));
    }
}
