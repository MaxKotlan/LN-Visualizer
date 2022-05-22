import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { graphStatisticsReducer } from './reducer';
import { MinMaxCalculatorService } from './services';

@NgModule({
    providers: [MinMaxCalculatorService],
    imports: [StoreModule.forFeature('graphStatisticsState', graphStatisticsReducer.reducer)],
})
export class GraphStatisticsModule {}
