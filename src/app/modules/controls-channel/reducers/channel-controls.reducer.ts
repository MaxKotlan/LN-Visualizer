import { createReducer, on } from '@ngrx/store';
import * as controlsActions from '../../controls/actions';
import * as channelControlsActions from '../actions';

export interface ChannelControlState {
    renderEdges: boolean;
    minimumEdges: number;
    edgeDepthTest: boolean;
    edgeDottedLine: boolean;
    capacityFilterEnable: boolean;
    capacityFilterAmount: number;
}

const initialState: ChannelControlState = {
    renderEdges: true,
    minimumEdges: 0,
    edgeDepthTest: true,
    edgeDottedLine: false,
    capacityFilterEnable: false,
    capacityFilterAmount: 8000000,
};

export const reducer = createReducer(
    initialState,

    on(
        controlsActions.setSavedStateFromLocalStorage,
        (_state, { savedState }) => savedState.channelControls || initialState,
    ),
    on(controlsActions.resetControlsToDefault, () => initialState),

    on(channelControlsActions.renderEdges, (state, { value }) => ({
        ...state,
        renderEdges: value,
    })),
    on(channelControlsActions.minEdgesRecompute, (state, { minEdges }) => ({
        ...state,
        minimumEdges: minEdges,
    })),
    on(channelControlsActions.setEdgeUseDottedLine, (state, { value }) => ({
        ...state,
        edgeDottedLine: value,
    })),
    on(channelControlsActions.setEdgeUseDepthTest, (state, { value }) => ({
        ...state,
        edgeDepthTest: value,
    })),
    on(channelControlsActions.capacityFilterEnable, (state, { value }) => ({
        ...state,
        capacityFilterEnable: value,
    })),
    on(channelControlsActions.capacityFilterAmount, (state, { value }) => ({
        ...state,
        capacityFilterAmount: value,
    })),
);