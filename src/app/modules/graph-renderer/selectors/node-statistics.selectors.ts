import { createFeatureSelector } from '@ngrx/store';
import { NodeStatisticsState } from '../reducer/node-statistics.reducer';

export const graphStatisticsSelector =
    createFeatureSelector<NodeStatisticsState>('nodeStatisticsState');
