import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RendererControlState } from '../reducer';

export const renderControlsSelector = createFeatureSelector<RendererControlState>('renderControls');

export const selectShowGrid = createSelector(renderControlsSelector, (state) => state.showGrid);
export const selectShowAxis = createSelector(renderControlsSelector, (state) => state.showAxis);
export const selectShowGraphAnimation = createSelector(
    renderControlsSelector,
    (state) => state.showGraphAnimation,
);
