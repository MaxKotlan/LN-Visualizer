import { Component } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Store } from '@ngrx/store';
import { pilotThickLinesEnabled$ } from 'src/app/modules/pilot-flags/selectors/pilot-flags.selectors';
import { GenericControlsState } from '../../../controls/reducers';
import {
    renderEdges,
    setEdgeUseDepthTest,
    setEdgeUseDottedLine,
    useLogColorScale,
} from '../../actions';
import {
    shouldRenderEdges,
    selectEdgeDepthTest,
    selectEdgeDottedLine,
    selectUseLogColorScale,
    selectEnableChannelFog,
    selectLineBackend,
} from '../../selectors';

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
    public selectUseLogColorScale$ = this.store.select(selectUseLogColorScale);
    public selectEnabledFog$ = this.store.select(selectEnableChannelFog);

    public thickLinesEnabled$ = this.store.select(pilotThickLinesEnabled$);
    public selectLineBackend$ = this.store.select(selectLineBackend);

    setShouldRenderEdges(event: MatCheckboxChange) {
        this.store.dispatch(renderEdges({ value: event.checked }));
    }

    setDepthTest(event: MatCheckboxChange) {
        this.store.dispatch(setEdgeUseDepthTest({ value: event.checked }));
    }

    setDottedLines(event: MatCheckboxChange) {
        this.store.dispatch(setEdgeUseDottedLine({ value: event.checked }));
    }

    setUseLogColorScale(event: MatCheckboxChange) {
        this.store.dispatch(useLogColorScale({ value: event.checked }));
    }
}
