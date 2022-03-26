import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { ControlsChannelModule } from '../controls-channel/controls-channel.module';
import { ControlsNodeModule } from '../controls-node/controls-node.module';
import { ControlsRendererModule } from '../controls-renderer/controls-renderer.module';
import { DonateModule } from '../donate/donate.module';
import { MaterialModule } from '../material';
import { ScreenSizeModule } from '../screen-size/screen-size.module';
import {
    CameraSettingsComponent,
    MiscSettingsComponent,
    NodeSettingsComponent,
    QuickControlsComponent,
    SearchComponent,
    SettingsModalComponent,
} from './components';
import { reducer } from './reducers';

@NgModule({
    declarations: [
        SearchComponent,
        QuickControlsComponent,
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
        ScreenSizeModule,
        StoreModule.forFeature('genericControls', reducer),
        DonateModule,
    ],
    exports: [
        SearchComponent,
        QuickControlsComponent,
        SettingsModalComponent,
        CameraSettingsComponent,
        NodeSettingsComponent,
        MiscSettingsComponent,
    ],
})
export class ControlsModule {}
