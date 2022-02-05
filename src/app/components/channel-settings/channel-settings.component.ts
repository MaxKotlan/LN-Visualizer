import { Component, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Store } from '@ngrx/store';
import {
    renderEdges,
    setEdgeUseDepthTest,
    setEdgeUseDottedLine,
} from 'src/app/actions/controls.actions';
import { ControlsState } from 'src/app/reducers/controls.reducer';
import {
    selectEdgeDepthTest,
    selectEdgeDottedLine,
    shouldRenderEdges,
} from 'src/app/selectors/controls.selectors';

@Component({
    selector: 'app-channel-settings',
    templateUrl: './channel-settings.component.html',
    styleUrls: ['./channel-settings.component.scss'],
})
export class ChannelSettingsComponent {
    constructor(private store: Store<ControlsState>) {}

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
