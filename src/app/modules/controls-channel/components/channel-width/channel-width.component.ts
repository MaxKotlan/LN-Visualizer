import { Component, OnInit } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { Store } from '@ngrx/store';
import { GenericControlsState } from 'src/app/modules/controls/reducers';
import { setChannelWidth } from '../../actions';
import { selectChannelWidth } from '../../selectors';

@Component({
    selector: 'app-channel-width',
    templateUrl: './channel-width.component.html',
    styleUrls: ['./channel-width.component.scss'],
})
export class ChannelWidthComponent {
    constructor(private store: Store<GenericControlsState>) {}

    public selectChannelWidth$ = this.store.select(selectChannelWidth);

    setChannelWidth(event: MatSliderChange) {
        this.store.dispatch(setChannelWidth({ value: event.value || 1 }));
    }
}
