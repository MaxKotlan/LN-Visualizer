import { createFeatureSelector } from '@ngrx/store';
import { NodeStatisticsState } from '../reducer/node-statistics.reducer';

export const nodeStatisticsState =
    createFeatureSelector<NodeStatisticsState>('nodeStatisticsState');
