import {
  ActionReducerMap,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import * as graphReducer from './graph.reducer';

export interface State {
  graphState: graphReducer.GraphState
}

export const reducers: ActionReducerMap<State> = {
  graphState: graphReducer.reducer,
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
