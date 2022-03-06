import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorScaleComponent } from './components';
import { MaterialModule } from '../material';
import { ChannelColorScaleComponent } from './components/channel-color-scale/channel-color-scale.component';

@NgModule({
    declarations: [ColorScaleComponent, ChannelColorScaleComponent],
    imports: [CommonModule, MaterialModule],
    exports: [ColorScaleComponent, ChannelColorScaleComponent],
})
export class UiModule {}
