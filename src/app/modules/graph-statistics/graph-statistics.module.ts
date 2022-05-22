import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { filteredStatisticsReducer, globalStatisticsReducer } from './reducer';
import { GlobalStatisticsCalculatorService } from './services';

@NgModule({
    providers: [GlobalStatisticsCalculatorService],
    imports: [
        StoreModule.forFeature('globalStatistics', globalStatisticsReducer.reducer),
        StoreModule.forFeature('filteredStatistics', filteredStatisticsReducer.reducer),
    ],
})
export class GraphStatisticsModule {}
