import { createAction, props } from '@ngrx/store';
import { Filter } from '../types/filter.interface';

export const addFilter = createAction('[filter] addFilter', props<{ value: Filter }>());

export const removeFilter = createAction('[filter] removeFilter', props<{ value: Filter }>());

export const removeFilterByKey = createAction(
    '[filter] removeFilterByKey',
    props<{ key: string }>(),
);

export const setAllowedFilterKeys = createAction(
    '[filter] setAllowedFilterKeys',
    props<{ value: string[] }>(),
);
