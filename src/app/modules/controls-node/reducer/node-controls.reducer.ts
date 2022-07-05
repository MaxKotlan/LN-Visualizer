import { createReducer, on } from '@ngrx/store';
import * as controlActions from '../../controls/actions';
import { initializeDefaultValue } from '../../controls/utils/default-settings-upgrader';
import * as nodeControlActions from '../actions/node-controls.actions';

export const networkOptions = [
    'Clearnet and Tor',
    'Clearnet Only',
    'Tor Only',
    'Has Clearnet',
    'Has Onion Address',
];

export interface NodeControlState {
    renderNodes: boolean;
    nodeSize: number;
    minNodeSize: number;
    uniformNodeSize: boolean;
    pointAttenuation: boolean;
    pointUseIcon: boolean;
    networkFilter: string;
}

const initialState: NodeControlState = {
    renderNodes: true,
    uniformNodeSize: false,
    nodeSize: 20,
    minNodeSize: 5.2,
    pointAttenuation: true,
    pointUseIcon: true,
    networkFilter: 'Clearnet and Tor',
};

export const reducer = createReducer(
    initialState,
    on(controlActions.setSavedStateFromLocalStorage, (_state, { savedState }) =>
        initializeDefaultValue(savedState.nodeControls, initialState),
    ),
    on(controlActions.resetControlsToDefault, () => initialState),
    on(nodeControlActions.renderNodes, (state, { value }) => ({ ...state, renderNodes: value })),
    on(nodeControlActions.setNodeSize, (state, { nodeSize }) => ({
        ...state,
        nodeSize: nodeSize,
        minNodeSize: state.minNodeSize > nodeSize ? nodeSize : state.minNodeSize,
    })),
    on(nodeControlActions.setMinimumNodeSize, (state, { nodeSize }) => ({
        ...state,
        minNodeSize: nodeSize,
    })),
    on(nodeControlActions.setPointAttenuation, (state, { value }) => ({
        ...state,
        pointAttenuation: value,
    })),
    on(nodeControlActions.setPointUseIcon, (state, { value }) => ({
        ...state,
        pointUseIcon: value,
    })),
    on(nodeControlActions.setUniformNodeSize, (state, { value }) => ({
        ...state,
        uniformNodeSize: value,
    })),
    on(nodeControlActions.setNetworkFilter, (state, { value }) => ({
        ...state,
        networkFilter: value,
    })),
);
