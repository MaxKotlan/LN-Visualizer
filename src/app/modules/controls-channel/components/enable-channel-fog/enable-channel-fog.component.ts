import { Component } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Store } from '@ngrx/store';
import { GenericControlsState } from 'src/app/modules/controls/reducers';
import { enableChannelFog } from '../../actions';
import { selectEnableChannelFog } from '../../selectors';

@Component({
    selector: 'app-enable-channel-fog',
    templateUrl: './enable-channel-fog.component.html',
    styleUrls: ['./enable-channel-fog.component.scss'],
})
export class EnableChannelFogComponent {
    constructor(private store: Store<GenericControlsState>) {}

    public selectEnableChannelFog$ = this.store.select(selectEnableChannelFog);

    setEnableChannelFog(event: MatCheckboxChange) {
        this.store.dispatch(enableChannelFog({ value: event.checked }));
    }
}
