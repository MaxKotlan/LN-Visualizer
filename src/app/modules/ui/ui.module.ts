import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    ColorScaleComponent,
    GlobalGraphStatsComponent,
    FilteredGraphStatsComponent,
    LoadingBarComponent,
    TooltipComponent,
} from './components';
import { MaterialModule } from '../material';
import { ChannelColorScaleComponent } from './components/channel-color-scale/channel-color-scale.component';
import { ErrorComponent } from './components/error';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { AppKeyValueStatsComponent } from './components/app-key-value-stats/app-key-value-stats.component';

@NgModule({
    declarations: [
        ColorScaleComponent,
        ChannelColorScaleComponent,
        ErrorComponent,
        LoadingBarComponent,
        TooltipComponent,
        GlobalGraphStatsComponent,
        LoadingSpinnerComponent,
        FilteredGraphStatsComponent,
        AppKeyValueStatsComponent,
    ],
    imports: [CommonModule, MaterialModule],
    exports: [
        ColorScaleComponent,
        ChannelColorScaleComponent,
        ErrorComponent,
        LoadingBarComponent,
        TooltipComponent,
        GlobalGraphStatsComponent,
        FilteredGraphStatsComponent,
        LoadingSpinnerComponent,
    ],
})
export class UiModule {}
