import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChannelColorScaleComponent, ColorScaleComponent } from './components';
import { MaterialModule } from '../material';
import { ColorScaleSettingsModalComponent } from './components/color-scale-settings-modal/color-scale-settings-modal.component';
import { ControlsChannelModule } from '../settings/controls-channel/controls-channel.module';

@NgModule({
    declarations: [
        ColorScaleComponent,
        ChannelColorScaleComponent,
        ColorScaleSettingsModalComponent,
    ],
    imports: [CommonModule, MaterialModule, ControlsChannelModule],
    exports: [ColorScaleComponent, ChannelColorScaleComponent],
})
export class ColorScaleModule {}
