import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { setChannelColorMap } from '../../actions';
import { ChannelControlState } from '../../reducers';
import { channelColorMap } from '../../selectors';

const colorMap = [
    'jet',
    'hsv',
    'hot',
    'cool',
    'spring',
    'summer',
    'autumn',
    'winter',
    'bone',
    'copper',
    'greys',
    'YIGnBu',
    'greens',
    'YIOrRd',
    'bluered',
    'RdBu',
    'picnic',
    'rainbow',
    'portland',
    'blackbody',
    'earth',
    'electric',
    'viridis',
    'inferno',
    'magma',
    'plasma',
    'warm',
    'cool',
    'rainbow-soft',
    'bathymetry',
    'cdom',
    'chlorophyll',
    'density',
    'freesurface-blue',
    'freesurface-red',
    'oxygen',
    'par',
    'phase',
    'salinity',
    'temperature',
    'turbidity',
    'velocity-blue',
    'velocity-green',
    'cubehelix',
];

@Component({
    selector: 'app-channel-color-map-dropdown',
    templateUrl: './channel-color-map-dropdown.component.html',
    styleUrls: ['./channel-color-map-dropdown.component.scss'],
})
export class ChannelColorMapDropdownComponent {
    constructor(private store$: Store<ChannelControlState>) {}

    public chanelColorDropDown$: Observable<string> = this.store$.select(channelColorMap);

    public colorMap = colorMap;

    valueChanged(event) {
        this.store$.dispatch(setChannelColorMap({ value: event }));
    }
}
