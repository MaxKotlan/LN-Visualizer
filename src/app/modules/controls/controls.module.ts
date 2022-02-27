import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    SearchComponent,
    QuickControlsComponent,
    SettingsComponent,
    SettingsModalComponent,
    ErrorComponent,
    LoadingBarComponent,
    GraphStatsComponent,
    CameraSettingsComponent,
    ChannelSettingsComponent,
    NodeSettingsComponent,
    MiscSettingsComponent,
    TooltipComponent,
} from './components';
import { MaterialModule } from '../material';
import { FormsModule } from '@angular/forms';
import { ControlsNodeModule } from '../controls-node/controls-node.module';
import { StoreModule } from '@ngrx/store';
import { reducer } from './reducers';
import { ControlsChannelModule } from '../controls-channel/controls-channel.module';

@NgModule({
    declarations: [
        SearchComponent,
        QuickControlsComponent,
        SettingsComponent,
        SettingsModalComponent,
        ErrorComponent,
        LoadingBarComponent,
        GraphStatsComponent,
        CameraSettingsComponent,
        MiscSettingsComponent,
        TooltipComponent,
    ],
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        ControlsNodeModule,
        ControlsChannelModule,
        StoreModule.forFeature('genericControls', reducer),
    ],
    exports: [
        SearchComponent,
        QuickControlsComponent,
        SettingsComponent,
        SettingsModalComponent,
        ErrorComponent,
        LoadingBarComponent,
        GraphStatsComponent,
        CameraSettingsComponent,
        NodeSettingsComponent,
        MiscSettingsComponent,
        TooltipComponent,
    ],
})
export class ControlsModule {}
