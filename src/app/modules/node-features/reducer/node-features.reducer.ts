import { createReducer, on } from '@ngrx/store';
import * as nodeFeatureActions from '../actions/node-feature.actions';

export interface NodeFeature {
    bit: number;
    is_known: boolean;
    is_required: boolean;
    type: string;
    filterEnabled: boolean;
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
        nodeFeatures: newNodeFeatures.map((x) => ({ ...x, filterEnabled: false })),
    })),
    on(nodeFeatureActions.updateFeatureFilter, (state, { bit, newValue }) => ({
        ...state,
        nodeFeatures: state.nodeFeatures.map((x) => {
            if (x.bit === bit) return { ...x, filterEnabled: newValue };
            return x;
        }),
    })),
    on(nodeFeatureActions.clearFeaturesInView, (state) => ({
        ...state,
        nodeFeatures: [],
    })),
);
