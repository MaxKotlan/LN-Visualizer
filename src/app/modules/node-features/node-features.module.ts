import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import * as featureReducer from './reducer/node-features.reducer';
import { NodeFeatureCheckerService } from './services';
import { NodeFeaturesEffects } from './effects/node-features.effects';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        EffectsModule.forFeature([NodeFeaturesEffects]),
        StoreModule.forFeature('nodeFeaturesState', featureReducer.reducer),
    ],
    providers: [NodeFeatureCheckerService],
})
export class NodeFeaturesModule {}
