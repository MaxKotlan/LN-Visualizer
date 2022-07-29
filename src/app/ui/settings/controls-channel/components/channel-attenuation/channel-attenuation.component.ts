import { Component } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Store } from '@ngrx/store';
import { setChannelAttenuation } from '../../actions';
import { selectLineAttenuation } from '../../selectors';

@Component({
    selector: 'app-channel-attenuation',
    templateUrl: './channel-attenuation.component.html',
    styleUrls: ['./channel-attenuation.component.scss'],
})
export class ChannelAttenuationComponent {
    constructor(private store: Store) {}

    selectChannelAttenuation$ = this.store.select(selectLineAttenuation);

    setChannelAttenuation(event: MatCheckboxChange) {
        this.store.dispatch(setChannelAttenuation({ value: event.checked }));
    }
}
