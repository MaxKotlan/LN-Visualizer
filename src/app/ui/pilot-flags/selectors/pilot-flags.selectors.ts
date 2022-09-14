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

export const sphereNodesEnabled$ = createSelector(pilotFlagSelector, (state) => state.sphereNodes);

export const fastModelDownloadEnabled$ = createSelector(
    pilotFlagSelector,
    (state) => state.fastModelDownload,
);

export const colorRangeMinMaxEnabled$ = createSelector(
    pilotFlagSelector,
    (state) => state.colorRangeMinMax,
);

export const nodeTableSearchEnabled$ = createSelector(
    pilotFlagSelector,
    (state) => state.nodeTableSearch,
);

export const nodeFeaturesFilterEnabled$ = createSelector(
    pilotFlagSelector,
    (state) => state.nodeFeaturesFilter,
);

export const strictPolicyScriptsEnabled$ = createSelector(
    pilotFlagSelector,
    (state) => state.strictPolicyScripts,
);

export const allPilotFlags$ = createSelector(pilotFlagSelector, (state) => ({ ...state }));
