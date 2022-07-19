import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import * as featureReducer from './reducer/node-features.reducer';
import { NodeFeatureCheckerService } from './services';

@NgModule({
    declarations: [],
    imports: [CommonModule, StoreModule.forFeature('nodeFeaturesState', featureReducer.reducer)],
    providers: [NodeFeatureCheckerService],
})
export class NodeFeaturesModule {}
