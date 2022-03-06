import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    ColorScaleComponent,
    GraphStatsComponent,
    LoadingBarComponent,
    TooltipComponent,
} from './components';
import { MaterialModule } from '../material';
import { ChannelColorScaleComponent } from './components/channel-color-scale/channel-color-scale.component';
import { ErrorComponent } from './components/error';

@NgModule({
    declarations: [
        ColorScaleComponent,
        ChannelColorScaleComponent,
        ErrorComponent,
        LoadingBarComponent,
        TooltipComponent,
        GraphStatsComponent,
    ],
    imports: [CommonModule, MaterialModule],
    exports: [
        ColorScaleComponent,
        ChannelColorScaleComponent,
        ErrorComponent,
        LoadingBarComponent,
        TooltipComponent,
        GraphStatsComponent,
    ],
})
export class UiModule {}
