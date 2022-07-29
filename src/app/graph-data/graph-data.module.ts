import { NgModule } from '@angular/core';
import { GraphNetworkingModule } from './graph-networking/graph-networking.module';
import { GraphStatisticsModule } from './graph-statistics';

@NgModule({
    imports: [GraphNetworkingModule, GraphStatisticsModule],
    exports: [GraphNetworkingModule, GraphStatisticsModule],
})
export class GraphDataModule {}
