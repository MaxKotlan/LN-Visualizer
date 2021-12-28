import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ControlsState } from "../reducers/controls.reducer";

export const controlsSelector = createFeatureSelector<ControlsState>('controlsState');

export const selectSearchString = createSelector(
    controlsSelector,
    (state) => state.searchText
)

export const shouldRenderEdges = createSelector(
    controlsSelector,
    (state) => state.renderEdges
)

export const selectNodeSize = createSelector(
    controlsSelector,
    (state) => state.nodeSize
)

export const selectPointAttenuation = createSelector(
    controlsSelector,
    (state) => state.pointAttenuation
)

export const selectPointUseIcon = createSelector(
    controlsSelector,
    (state) => state.pointUseIcon
)