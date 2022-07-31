import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChannelColorScaleComponent, ColorScaleComponent } from './components';
import { MaterialModule } from '../material';

@NgModule({
    declarations: [ColorScaleComponent, ChannelColorScaleComponent],
    imports: [CommonModule, MaterialModule],
    exports: [ColorScaleComponent, ChannelColorScaleComponent],
})
export class ColorScaleModule {}
