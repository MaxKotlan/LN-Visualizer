import { createReducer } from '@ngrx/store';

interface QuickControl {
    filterId: string;
    lowerBound: number;
    upperBound: number;
    lowerVal: number;
    upperVal: number;
    scriptType: 'Node' | 'Channel' | 'Policy';
}

export interface QuickControlsState {
    controlState: Record<string, QuickControl>;
}

const quickControlsStateInitialState: QuickControlsState = {
    controlState: {},
};

export const quickControlsReducer = createReducer(quickControlsStateInitialState);
