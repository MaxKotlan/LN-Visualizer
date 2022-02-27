import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChannelSettingsComponent } from './components';
import { MaterialModule } from '../material';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { reducer } from './reducers';

@NgModule({
    declarations: [ChannelSettingsComponent],
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        StoreModule.forFeature('channelControls', reducer),
    ],
    exports: [ChannelSettingsComponent],
})
export class ControlsChannelModule {}
