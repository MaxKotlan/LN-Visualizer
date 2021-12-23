import { createReducer, on } from '@ngrx/store';
import { LnGraph } from '../types/graph.interface';
import * as graphActions from '../actions/graph.actions';

export interface GraphState {
    graphUnsorted: LnGraph
};

const initialState: GraphState = {
    graphUnsorted: { nodes: [], edges: [] }
};

export const reducer = createReducer(
    initialState,
    on(
        graphActions.requestGraphSuccess,
        (state, {graph}) => ({...state, graphUnsorted: graph}),
    ),
);