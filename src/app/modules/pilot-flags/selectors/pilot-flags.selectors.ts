import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PilotFlags } from '../reducer';

export const pilotFlagSelector = createFeatureSelector<PilotFlags>('pilotFlags');

export const pilotIsUnitConversionsEnabled$ = createSelector(
    pilotFlagSelector,
    (state) => state.unitConversions,
);
