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
        ChannelSettingsComponent,
        NodeSettingsComponent,
        MiscSettingsComponent,
        TooltipComponent,
    ],
    imports: [CommonModule, MaterialModule, FormsModule],
    exports: [
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
    ],
})
export class ControlsModule {}
