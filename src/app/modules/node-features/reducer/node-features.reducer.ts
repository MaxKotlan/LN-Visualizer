import { createReducer, on } from '@ngrx/store';
import * as nodeFeatureActions from '../actions/node-feature.actions';

export interface NodeFeature {
    bit: number;
    is_known: boolean;
    is_required: boolean;
    type: string;
}

export interface NodeFeaturesState {
    nodeFeatures: NodeFeature[];
}

const nodeFeaturesInitialState: NodeFeaturesState = {
    nodeFeatures: [],
};

export const reducer = createReducer(
    nodeFeaturesInitialState,
    on(nodeFeatureActions.updateFeaturesInView, (state, { newNodeFeatures }) => ({
        ...state,
        nodeFeatures: newNodeFeatures,
    })),
    on(nodeFeatureActions.clearFeaturesInView, (state) => ({
        ...state,
        nodeFeatures: [],
    })),
);
