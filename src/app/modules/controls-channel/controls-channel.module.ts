import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChannelSettingsComponent } from './components';
import { MaterialModule } from '../material';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { reducer } from './reducers';
import { ChannelColorDropdownComponent } from './components/channel-color-dropdown/channel-color-dropdown.component';
import { ChannelColorMapDropdownComponent } from './components/channel-color-map-dropdown/channel-color-map-dropdown.component';

@NgModule({
    declarations: [ChannelSettingsComponent, ChannelColorDropdownComponent, ChannelColorMapDropdownComponent],
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        StoreModule.forFeature('channelControls', reducer),
    ],
    exports: [ChannelSettingsComponent],
})
export class ControlsChannelModule {}
