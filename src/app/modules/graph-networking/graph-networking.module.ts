import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { NetworkEffects } from './effects';
import { InitialSyncApiService } from './services';
import { Store } from '@ngrx/store';
import { initializeGraphSyncProcess } from '../graph-renderer/actions';
import moment from 'moment';

@NgModule({
    declarations: [],
    imports: [CommonModule, EffectsModule.forFeature([NetworkEffects])],
    providers: [InitialSyncApiService],
})
export class GraphNetworkingModule {
    constructor(private store$: Store<any>) {
        const lastInitSync = localStorage.getItem('database-sync-time');
        const initialSyncDays = moment().diff(lastInitSync, 'days');
        if (initialSyncDays > 1) this.store$.dispatch(initializeGraphSyncProcess());
    }
}
