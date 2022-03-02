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
import { ChannelColorScaleComponent } from './components/channel-color-scale/channel-color-scale.component';

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
        ChannelColorScaleComponent,
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
        ChannelColorScaleComponent,
    ],
})
export class ControlsModule {}
