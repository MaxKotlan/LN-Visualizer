import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FilterViewState } from '../reducer';

export const filterViewState = createFeatureSelector<FilterViewState>('filterViewState');

export const scriptType = createSelector(filterViewState, (state) => state.scriptType);
export const scriptSource = createSelector(filterViewState, (state) => state.scriptSource);
