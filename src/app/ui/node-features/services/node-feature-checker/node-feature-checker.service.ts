import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { LndNode } from 'api/src/models';
import { NodeFeature } from '../../reducer/node-features.reducer';
import * as nodeFeatureActions from '../../actions/node-feature.actions';

@Injectable({
    providedIn: 'root',
})
export class NodeFeatureCheckerService {
    constructor(private store: Store) {}

    private tempRegistry: Map<number, NodeFeature> = new Map<number, NodeFeature>();

    public reset() {
        this.tempRegistry.clear();
        this.store.dispatch(nodeFeatureActions.clearFeaturesInView());
    }

    public checkNodeForNewFeatures(node: LndNode) {
        node.features.forEach((feature: NodeFeature) => {
            if (!this.tempRegistry.has(feature.bit)) {
                this.tempRegistry.set(feature.bit, feature);
            }
        });
    }

    public updateStore() {
        this.store.dispatch(
            nodeFeatureActions.updateFeaturesInView({
                newNodeFeatures: Array.from(this.tempRegistry.values()),
            }),
        );
    }
}
