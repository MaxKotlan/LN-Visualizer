import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ColorScaleModule } from '../color-scale/color-scale.module';
import { MaterialModule } from '../material';
import {
    FilteredGraphStatsComponent,
    GlobalGraphStatsComponent,
    LoadingBarComponent,
    TooltipComponent,
} from './components';
import { AppKeyValueStatsComponent } from './components/app-key-value-stats/app-key-value-stats.component';
import { ErrorComponent } from './components/error';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';

@NgModule({
    declarations: [
        ErrorComponent,
        LoadingBarComponent,
        TooltipComponent,
        GlobalGraphStatsComponent,
        LoadingSpinnerComponent,
        FilteredGraphStatsComponent,
        AppKeyValueStatsComponent,
    ],
    imports: [CommonModule, MaterialModule, ColorScaleModule],
    exports: [
        ErrorComponent,
        LoadingBarComponent,
        TooltipComponent,
        GlobalGraphStatsComponent,
        FilteredGraphStatsComponent,
        LoadingSpinnerComponent,
        ColorScaleModule,
    ],
})
export class MiscModule {}
