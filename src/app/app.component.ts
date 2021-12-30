import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as controlsActions from './actions/controls.actions';
import * as graphActions from './actions/graph.actions';
import { selectGraphError, selectGraphLoadingState, shouldShowErrorMessage } from './selectors/graph.selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'LN-Visualizer';

  constructor(private store$: Store){}

  ngOnInit(){
    this.store$.dispatch(controlsActions.loadSavedState());
    this.store$.dispatch(graphActions.requestGraph());
  }

  public isGraphLoading$ = this.store$.select(selectGraphLoadingState);
  public shouldShowErrorMessage$ = this.store$.select(shouldShowErrorMessage);

}
