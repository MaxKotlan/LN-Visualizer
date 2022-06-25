import { createReducer, on } from '@ngrx/store';
import * as filterViewActions from '../actions/filter-view.actions';
import { channelDemoSource } from '../components/add-expression/add-expression.component';

export interface FilterViewState {
    scriptType: 'node' | 'channel';
    scriptSource: string;
}

const initialState: FilterViewState = {
    scriptType: 'channel',
    scriptSource: channelDemoSource,
};

export const filterViewReducer = createReducer(
    initialState,
    on(filterViewActions.setScriptType, (state, { value }) => ({
        ...state,
        scriptType: value,
    })),
    on(filterViewActions.setScriptSource, (state, { value }) => ({
        ...state,
        scriptSource: value,
    })),
);
