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

@NgModule({
    declarations: [],
    imports: [CommonModule, EffectsModule.forFeature([NetworkEffects])],
    providers: [InitialSyncApiService],
})
export class GraphNetworkingModule {
    constructor(private store$: Store<any>, private graphDatabaseService: GraphDatabaseService) {
        this.getData();
    }

    async getData() {
        const lastInitSync = localStorage.getItem('database-sync-time');
        const initialSyncDays = moment().diff(lastInitSync, 'days');
        const dataBaseExists = await this.graphDatabaseService.databaseExists();
        if (!lastInitSync || initialSyncDays >= 1 || !dataBaseExists) {
            this.store$.dispatch(initializeGraphSyncProcess());
        } else {
            this.store$.dispatch(loadGraphFromStorage());
        }
    }
}
