import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PilotFlags } from '../reducer';

export const pilotFlagSelector = createFeatureSelector<PilotFlags>('pilotFlags');

export const pilotIsUnitConversionsEnabled$ = createSelector(
    pilotFlagSelector,
    (state) => state.unitConversions,
);

export const pilotThickLinesEnabled$ = createSelector(
    pilotFlagSelector,
    (state) => state.thickLines,
);

export const pilotDepthFilterEnabled$ = createSelector(
    pilotFlagSelector,
    (state) => state.depthFilter,
);
