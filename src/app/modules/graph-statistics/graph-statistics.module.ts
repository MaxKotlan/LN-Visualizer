import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { filteredStatisticsReducer, globalStatisticsReducer } from './reducer';
import { MinMaxCalculatorService } from './services';

@NgModule({
    providers: [MinMaxCalculatorService],
    imports: [
        StoreModule.forFeature('globalStatistics', globalStatisticsReducer.reducer),
        StoreModule.forFeature('filteredStatistics', filteredStatisticsReducer.reducer),
    ],
})
export class GraphStatisticsModule {}
