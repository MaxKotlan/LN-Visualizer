// import { ActionReducerMap, MetaReducer } from '@ngrx/store';
// import { environment } from '../../../../environments/environment';
// import * as nodeControlsReducer from '../../controls-node/reducer';
// import * as controlsReducer from './controls.reducer';

// export interface ControlsState {
//     nodeControlsState: nodeControlsReducer.NodeControlState;
//     genericControlsState: controlsReducer.GenericControlsState;
// }

// export const reducers: ActionReducerMap<ControlsState> = {
//     nodeControlsState: nodeControlsReducer.reducer,
//     genericControlsState: controlsReducer.reducer,
// };

// export const metaReducers: MetaReducer<ControlsState>[] = !environment.production ? [] : [];
export * from './controls.reducer';
