import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { NetworkEffects } from './effects';
import { InitialSyncApiService } from './services';
import { Store } from '@ngrx/store';
import { initializeGraphSyncProcess } from '../graph-renderer/actions';

@NgModule({
    declarations: [],
    imports: [CommonModule, EffectsModule.forFeature([NetworkEffects])],
    providers: [InitialSyncApiService],
})
export class GraphNetworkingModule {
    constructor(private store$: Store<any>) {
        this.store$.dispatch(initializeGraphSyncProcess());
    }
}
