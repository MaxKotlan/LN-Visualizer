import { Component, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Store } from '@ngrx/store';
import { GenericControlsState } from '../../../controls/reducers';
import { useLogColorScale } from '../../actions';
import { selectUseLogColorScale } from '../../selectors';

@Component({
    selector: 'app-log-scale',
    templateUrl: './log-scale.component.html',
    styleUrls: ['./log-scale.component.scss'],
})
export class LogScaleComponent {
    constructor(private store: Store<GenericControlsState>) {}

    public selectUseLogColorScale$ = this.store.select(selectUseLogColorScale);

    setUseLogColorScale(event: MatCheckboxChange) {
        this.store.dispatch(useLogColorScale({ value: event.checked }));
    }
}
