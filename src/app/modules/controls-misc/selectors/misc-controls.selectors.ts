import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MiscControlState } from '../reducers/misc-controls.reducer';

export const miscControlsSelector = createFeatureSelector<MiscControlState>('miscControls');

export const donateLinkVisible = createSelector(
    miscControlsSelector,
    (state) => state.donateLinkVisible,
);
