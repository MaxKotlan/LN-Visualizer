import { Component, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Store } from '@ngrx/store';
import { renderEdges, setEdgeUseDepthTest, setEdgeUseDottedLine } from '../../actions';
import {
    selectEdgeDepthTest,
    selectEdgeDottedLine,
    shouldRenderEdges,
} from 'src/app/modules/controls/selectors/controls.selectors';
import { GenericControlsState } from '../../reducers';

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
