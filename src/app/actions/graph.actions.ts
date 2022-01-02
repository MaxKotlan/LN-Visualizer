import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';
import { LnGraph } from '../types/graph.interface';

export const requestGraph = createAction('[graph] requestGraph');

export const requestGraphSuccess = createAction(
  '[graph] requestGraphSuccess',
  props<{ graph: LnGraph }>(),
);

export const requestGraphFailure = createAction(
  '[graph] requestGraphFailure',
  props<{ error: HttpErrorResponse }>(),
);

export const dismissError = createAction('[graph] dismissError');
