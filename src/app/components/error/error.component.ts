import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { dismissError, requestGraph } from 'src/app/actions/graph.actions';
import { GraphState } from 'src/app/reducers/graph.reducer';
import { canDismissError, selectGraphError } from 'src/app/selectors/graph.selectors';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
})
export class ErrorComponent {
  constructor(private store$: Store<GraphState>) {}

  public selectGraphError$ = this.store$.select(selectGraphError);
  public canDismissError$ = this.store$.select(canDismissError);

  retryRequest() {
    this.store$.dispatch(requestGraph());
  }

  dismissError() {
    this.store$.dispatch(dismissError());
  }
}
