import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { setChannelWidthMapping } from '../../actions';
import { selectChannelWidthMapping } from '../../selectors';

@Component({
    selector: 'app-channel-width-property',
    templateUrl: './channel-width-property.component.html',
    styleUrls: ['./channel-width-property.component.scss'],
})
export class ChannelWidthPropertyComponent {
    constructor(private store$: Store) {}

    lineOptions = ['uniform', 'channel capacity'];

    public channelWidthProperty$ = this.store$.select(selectChannelWidthMapping);

    valueChanged(event) {
        this.store$.dispatch(setChannelWidthMapping({ value: event }));
    }
}
