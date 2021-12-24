import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as graphActions from './actions/graph.actions';
import { selectGraphLoadingState } from './selectors/graph.selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'LN-Visualizer';

  constructor(private store$: Store){}

  ngOnInit(){
    this.store$.dispatch(graphActions.requestGraph())
  }

  public isGraphLoading$ = this.store$.select(selectGraphLoadingState) 

}
