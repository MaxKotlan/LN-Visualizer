import { Component, ViewChild } from '@angular/core';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { Store } from '@ngrx/store';
import { GenericControlsState } from 'src/app/ui/controls/reducers';
import { enableChannelFog } from '../../actions';
import { selectEnableChannelFog } from '../../selectors';

@Component({
    selector: 'app-enable-channel-fog',
    templateUrl: './enable-channel-fog.component.html',
    styleUrls: ['./enable-channel-fog.component.scss'],
})
export class EnableChannelFogComponent {
    @ViewChild(MatCheckbox) public checkbox: MatCheckbox;

    constructor(private store: Store<GenericControlsState>) {}

    public selectEnableChannelFog$ = this.store.select(selectEnableChannelFog);

    setEnableChannelFog(event: MatCheckboxChange) {
        this.store.dispatch(enableChannelFog({ value: event.checked }));
    }
}
