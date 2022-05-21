import { createReducer, on } from '@ngrx/store';
import * as controlsActions from '../../controls/actions';
import * as channelControlsActions from '../actions';

export interface ChannelControlState {
    renderEdges: boolean;
    minimumEdges: number;
    edgeDepthTest: boolean;
    edgeDottedLine: boolean;
    channelColor: string;
    channelColorMap: string;
    useLogColorScale: boolean;
    enableChannelFog: boolean;
    fogDistance: number;
}

const initialState: ChannelControlState = {
    renderEdges: true,
    minimumEdges: 0,
    edgeDepthTest: true,
    edgeDottedLine: false,
    channelColor: 'channel-capacity',
    channelColorMap: 'electric',
    useLogColorScale: true,
    enableChannelFog: false,
    fogDistance: 1.0,
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
    on(channelControlsActions.setChannelColor, (state, { value }) => ({
        ...state,
        channelColor: value,
    })),
    on(channelControlsActions.setChannelColorMap, (state, { value }) => ({
        ...state,
        channelColorMap: value,
    })),
    on(channelControlsActions.useLogColorScale, (state, { value }) => ({
        ...state,
        useLogColorScale: value,
    })),
    on(channelControlsActions.enableChannelFog, (state, { value }) => ({
        ...state,
        enableChannelFog: value,
    })),
    on(channelControlsActions.setFogDistance, (state, { value }) => ({
        ...state,
        fogDistance: value,
    })),
);
