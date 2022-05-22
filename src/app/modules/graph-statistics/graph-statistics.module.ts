import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { graphStatisticsReducer, nodeStatisticsReducer } from './reducer';
import { MinMaxCalculatorService } from './services';

@NgModule({
    providers: [MinMaxCalculatorService],
    imports: [
        StoreModule.forFeature('graphStatisticsState', graphStatisticsReducer.reducer),
        StoreModule.forFeature('nodeStatisticsState', nodeStatisticsReducer.reducer),
    ],
})
export class GraphStatisticsModule {}
