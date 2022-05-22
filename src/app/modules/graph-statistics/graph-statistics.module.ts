import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { filteredStatisticsReducer, globalStatisticsReducer } from './reducer';
import { MinMaxCalculatorService } from './services';

@NgModule({
    providers: [MinMaxCalculatorService],
    imports: [
        StoreModule.forFeature('globalStatisticsState', globalStatisticsReducer.reducer),
        StoreModule.forFeature('filteredStatisticsState', filteredStatisticsReducer.reducer),
    ],
})
export class GraphStatisticsModule {}
