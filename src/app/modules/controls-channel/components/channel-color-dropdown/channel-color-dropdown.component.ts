import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { setChannelColor } from '../../actions';
import { ChannelControlState } from '../../reducers';
import { channelColor } from '../../selectors';

@Component({
    selector: 'app-channel-color-dropdown',
    templateUrl: './channel-color-dropdown.component.html',
    styleUrls: ['./channel-color-dropdown.component.scss'],
})
export class ChannelColorDropdownComponent {
    constructor(private store$: Store<ChannelControlState>) {}

    public chanelColorDropDown$: Observable<string> = this.store$.select(channelColor);

    valueChanged(event) {
        this.store$.dispatch(setChannelColor({ value: event }));
    }
}
