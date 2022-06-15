import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { NetworkEffects } from './effects';
import { InitialSyncApiService } from './services';
import { Store } from '@ngrx/store';
import { initializeGraphSyncProcess } from '../graph-renderer/actions';
import moment from 'moment';
import { GraphDatabaseService } from '../graph-renderer/services/graph-database/graph-database.service';
import { loadGraphFromStorage } from '../graph-renderer/actions/graph-database.actions';
import { BinaryMeshApiService } from './services/binary-mesh-api.service';
import { fastModelDownloadEnabled$ } from '../pilot-flags/selectors/pilot-flags.selectors';

@NgModule({
    declarations: [],
    imports: [CommonModule, EffectsModule.forFeature([NetworkEffects])],
    providers: [InitialSyncApiService, BinaryMeshApiService],
})
export class GraphNetworkingModule {
    constructor(
        private store$: Store<any>,
        private graphDatabaseService: GraphDatabaseService,
        private binaryMeshApiService: BinaryMeshApiService,
    ) {
        this.getData();
    }

    async getData() {
        this.store$.select(fastModelDownloadEnabled$).subscribe(async (isEnabled) => {
            if (isEnabled) {
                this.binaryMeshApiService.getNodePositions();
                this.binaryMeshApiService.getChannelBuffer();
            } else {
                const lastInitSync = localStorage.getItem('database-sync-time');
                const initialSyncDays = moment().diff(lastInitSync, 'days');
                const dataBaseExists = await this.graphDatabaseService.databaseExists();
                if (!lastInitSync || initialSyncDays >= 1 || !dataBaseExists) {
                    this.store$.dispatch(initializeGraphSyncProcess());
                } else {
                    this.store$.dispatch(loadGraphFromStorage());
                }
            }
        });
    }
}
