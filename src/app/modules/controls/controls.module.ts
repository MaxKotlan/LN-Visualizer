import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { ControlsChannelModule } from '../controls-channel/controls-channel.module';
import { ControlsMiscModule } from '../controls-misc/controls-misc.module';
import { ControlsNodeModule } from '../controls-node/controls-node.module';
import { ControlsRendererModule } from '../controls-renderer/controls-renderer.module';
import { ControlsSearchModule } from '../controls-search/controls-search.module';
import { MaterialModule } from '../material';
import { ScreenSizeModule } from '../screen-size/screen-size.module';
import {
    CameraSettingsComponent,
    NodeSettingsComponent,
    QuickControlsComponent,
    SettingsModalComponent,
} from './components';
import { reducer } from './reducers';

@NgModule({
    declarations: [QuickControlsComponent, SettingsModalComponent, CameraSettingsComponent],
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        ControlsNodeModule,
        ControlsChannelModule,
        ControlsRendererModule,
        ControlsMiscModule,
        ScreenSizeModule,
        ControlsSearchModule,
        StoreModule.forFeature('genericControls', reducer),
    ],
    exports: [
        QuickControlsComponent,
        SettingsModalComponent,
        CameraSettingsComponent,
        NodeSettingsComponent,
    ],
})
export class ControlsModule {}
