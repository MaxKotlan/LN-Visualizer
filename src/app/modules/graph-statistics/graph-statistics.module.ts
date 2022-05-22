import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { filteredStatisticsReducer, globalStatisticsReducer } from './reducer';
import { FilteredStatisticsCalculatorService, GlobalStatisticsCalculatorService } from './services';

@NgModule({
    providers: [GlobalStatisticsCalculatorService, FilteredStatisticsCalculatorService],
    imports: [
        StoreModule.forFeature('globalStatistics', globalStatisticsReducer.reducer),
        StoreModule.forFeature('filteredStatistics', filteredStatisticsReducer.reducer),
    ],
})
export class GraphStatisticsModule {}
