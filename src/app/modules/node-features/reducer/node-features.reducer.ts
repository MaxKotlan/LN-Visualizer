import { createReducer } from '@ngrx/store';

interface NodeFeature {
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

export const reducer = createReducer(nodeFeaturesInitialState);
