import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ChannelEffects, NodeEffects } from './effects';

@NgModule({
    imports: [EffectsModule.forFeature([NodeEffects, ChannelEffects])],
})
export class GraphProcessDataModule {}
