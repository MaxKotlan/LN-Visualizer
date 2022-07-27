import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { EffectsModule } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import moment from 'moment';
import { initializeGraphSyncProcess } from 'src/app/renderer/graph-renderer/actions';
import { loadGraphFromStorage } from 'src/app/renderer/graph-renderer/actions/graph-database.actions';
import { GraphDatabaseService } from 'src/app/renderer/graph-renderer/services/graph-database/graph-database.service';
import { fastModelDownloadEnabled$ } from '../pilot-flags/selectors/pilot-flags.selectors';
import { NetworkEffects } from './effects';
import { InitialSyncApiService } from './services';
import { BinaryMeshApiService } from './services/binary-mesh-api.service';

@UntilDestroy()
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
        this.store$
            .select(fastModelDownloadEnabled$)
            .pipe(untilDestroyed(this))
            .subscribe(async (isEnabled) => {
                if (isEnabled) {
                    this.binaryMeshApiService.getNodePositions();
                    this.binaryMeshApiService.getChannelBuffer();
                } else {
                    const lastInitSync = localStorage.getItem('database-sync-time');
                    const initialSyncDays = moment().diff(lastInitSync, 'days');
                    const dataBaseExists = await this.graphDatabaseService.databaseExists();
                    if (!lastInitSync || initialSyncDays >= 1 || !dataBaseExists) {
                        this.store$.dispatch(initializeGraphSyncProcess({}));
                    } else {
                        this.store$.dispatch(loadGraphFromStorage());
                    }
                }
            });
    }
}
