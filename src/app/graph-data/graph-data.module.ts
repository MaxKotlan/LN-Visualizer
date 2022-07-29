import { NgModule } from '@angular/core';
import { DataRegistryModule } from './data-registries/data-registries.module';
import { GraphIndexdbModule } from './graph-indexdb/graph-indexdb.module';
import { GraphNetworkingModule } from './graph-networking/graph-networking.module';
import { GraphProcessDataModule } from './graph-process-data/graph-process-data.module';
import { GraphStatisticsModule } from './graph-statistics';

@NgModule({
    imports: [
        GraphNetworkingModule,
        GraphStatisticsModule,
        GraphIndexdbModule,
        GraphProcessDataModule,
        DataRegistryModule,
    ],
    exports: [
        GraphNetworkingModule,
        GraphStatisticsModule,
        GraphIndexdbModule,
        GraphProcessDataModule,
        DataRegistryModule,
    ],
})
export class GraphDataModule {}
