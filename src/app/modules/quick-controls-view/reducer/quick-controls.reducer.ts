import { createReducer } from '@ngrx/store';
import { MinMax } from 'src/app/types/min-max-total.interface';

export interface QuickControl {
    name: string;
    baseUnit: 'number' | 'msat' | 'sat' | 'block-delta' | 'block-height';
    scriptType: 'policy' | 'channel' | 'node';
    minMax: MinMax | null;
}

export interface QuickControls {
    controls: QuickControl[];
}

export const initialState: QuickControls = {
    controls: [
        {
            name: 'capacity',
            baseUnit: 'sat',
            scriptType: 'channel',
            minMax: null,
        },
        {
            name: 'base_fee_mtokens',
            baseUnit: 'msat',
            scriptType: 'policy',
            minMax: null,
        },
    ],
};

export const reducer = createReducer(initialState);
