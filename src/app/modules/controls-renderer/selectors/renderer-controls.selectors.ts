import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RendererControlState } from '../reducer';

export const renderControlsSelector = createFeatureSelector<RendererControlState>('renderControls');

export const selectShowGrid = createSelector(renderControlsSelector, (state) => state.showGrid);
export const selectShowAxis = createSelector(renderControlsSelector, (state) => state.showAxis);
export const selectShowGraphAnimation = createSelector(
    renderControlsSelector,
    (state) => state.showGraphAnimation,
);

export const selectNodeMotionIntensity = createSelector(
    renderControlsSelector,
    (state) => state.nodeMotionIntensity,
);

export const selectNodeTimeIntensity = createSelector(
    renderControlsSelector,
    (state) => state.nodeTimeIntensity || 0,
);
