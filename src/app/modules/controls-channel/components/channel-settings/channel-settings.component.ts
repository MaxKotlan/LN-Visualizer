import { Component } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Store } from '@ngrx/store';
import { GenericControlsState } from '../../../controls/reducers';
import { renderEdges, setEdgeUseDepthTest, setEdgeUseDottedLine } from '../../actions';
import { shouldRenderEdges, selectEdgeDepthTest, selectEdgeDottedLine } from '../../selectors';

@Component({
    selector: 'app-channel-settings',
    templateUrl: './channel-settings.component.html',
    styleUrls: ['./channel-settings.component.scss'],
})
export class ChannelSettingsComponent {
    constructor(private store: Store<GenericControlsState>) {}

    public shouldRenderEdges$ = this.store.select(shouldRenderEdges);
    public selectEdgeDepthTest$ = this.store.select(selectEdgeDepthTest);
    public selectEdgeDottedLine$ = this.store.select(selectEdgeDottedLine);

    setShouldRenderEdges(event: MatCheckboxChange) {
        this.store.dispatch(renderEdges({ value: event.checked }));
    }

    setDepthTest(event: MatCheckboxChange) {
        this.store.dispatch(setEdgeUseDepthTest({ value: event.checked }));
    }

    setDottedLines(event: MatCheckboxChange) {
        this.store.dispatch(setEdgeUseDottedLine({ value: event.checked }));
    }
}
