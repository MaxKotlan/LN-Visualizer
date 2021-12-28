import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ControlsState } from "../reducers/controls.reducer";

export const controlsSelector = createFeatureSelector<ControlsState>('controlsState');

export const selectSearchString = createSelector(
    controlsSelector,
    (state) => state.searchText
)
