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
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { UnitPipe } from './pipes/unit.pipe';

@NgModule({
    declarations: [
        ColorScaleComponent,
        ChannelColorScaleComponent,
        ErrorComponent,
        LoadingBarComponent,
        TooltipComponent,
        GraphStatsComponent,
        LoadingSpinnerComponent,
        UnitPipe,
    ],
    imports: [CommonModule, MaterialModule],
    exports: [
        ColorScaleComponent,
        ChannelColorScaleComponent,
        ErrorComponent,
        LoadingBarComponent,
        TooltipComponent,
        GraphStatsComponent,
        LoadingSpinnerComponent,
    ],
})
export class UiModule {}
