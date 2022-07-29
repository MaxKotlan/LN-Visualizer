import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { GraphStatisticsEffects } from './effects/graph-statistics.effects';
import { filteredStatisticsReducer, globalStatisticsReducer } from './reducer';
import { FilteredStatisticsCalculatorService, GlobalStatisticsCalculatorService } from './services';

@NgModule({
    providers: [GlobalStatisticsCalculatorService, FilteredStatisticsCalculatorService],
    imports: [
        StoreModule.forFeature('globalStatistics', globalStatisticsReducer.reducer),
        StoreModule.forFeature('filteredStatistics', filteredStatisticsReducer.reducer),
        EffectsModule.forFeature([GraphStatisticsEffects]),
    ],
})
export class GraphStatisticsModule {}
