import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { ControlsChannelModule } from '../controls-channel/controls-channel.module';
import { ControlsNodeModule } from '../controls-node/controls-node.module';
import { ControlsRendererModule } from '../controls-renderer/controls-renderer.module';
import { MaterialModule } from '../material';
import {
    CameraSettingsComponent,
    MiscSettingsComponent,
    NodeSettingsComponent,
    QuickControlsComponent,
    SearchComponent,
    SettingsComponent,
    SettingsModalComponent,
} from './components';
import { reducer } from './reducers';

@NgModule({
    declarations: [
        SearchComponent,
        QuickControlsComponent,
        SettingsComponent,
        SettingsModalComponent,
        CameraSettingsComponent,
        MiscSettingsComponent,
    ],
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        ControlsNodeModule,
        ControlsChannelModule,
        ControlsRendererModule,
        StoreModule.forFeature('genericControls', reducer),
    ],
    exports: [
        SearchComponent,
        QuickControlsComponent,
        SettingsComponent,
        SettingsModalComponent,
        CameraSettingsComponent,
        NodeSettingsComponent,
        MiscSettingsComponent,
    ],
})
export class ControlsModule {}
