import { createFeatureSelector, createSelector } from '@ngrx/store';
import { QuickControls } from '../reducer/quick-controls.reducer';

export const graphSelector = createFeatureSelector<QuickControls>('quickControls');
export const selectQuickControls = createSelector(graphSelector, (state) => state.controls);
