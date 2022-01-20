import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../environments/environment';
import * as controlsReducer from './controls.reducer';
import * as graphReducer from './graph.reducer';

export interface State {
    graphState: graphReducer.GraphState;
    controlsState: controlsReducer.ControlsState;
}

export const reducers: ActionReducerMap<State> = {
    graphState: graphReducer.reducer,
    controlsState: controlsReducer.reducer,
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
