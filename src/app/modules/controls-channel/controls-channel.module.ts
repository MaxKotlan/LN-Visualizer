import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChannelSettingsComponent } from './components';
import { MaterialModule } from '../material';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { reducer } from './reducers';
import { ChannelColorDropdownComponent } from './components/channel-color-dropdown/channel-color-dropdown.component';
import { ChannelColorMapDropdownComponent } from './components/channel-color-map-dropdown/channel-color-map-dropdown.component';
import { EnableChannelFogComponent } from './components/enable-channel-fog/enable-channel-fog.component';
import { FogDistanceComponent } from './components/fog-distance/fog-distance.component';
import { ChannelWidthComponent } from './components/channel-width/channel-width.component';
import { LineBackedDropdownComponent } from './components/line-backed-dropdown/line-backed-dropdown.component';
import { ChannelAttenuationComponent } from './components/channel-attenuation/channel-attenuation.component';
import { ChannelWidthPropertyComponent } from './components/channel-width-property/channel-width-property.component';

@NgModule({
    declarations: [ChannelSettingsComponent, ChannelColorDropdownComponent, ChannelColorMapDropdownComponent, EnableChannelFogComponent, FogDistanceComponent, ChannelWidthComponent, LineBackedDropdownComponent, ChannelAttenuationComponent, ChannelWidthPropertyComponent],
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        StoreModule.forFeature('channelControls', reducer),
    ],
    exports: [ChannelSettingsComponent],
})
export class ControlsChannelModule {}
