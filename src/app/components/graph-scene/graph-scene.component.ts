import { Component, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { SceneComponent } from 'atft';
import { GraphState } from 'src/app/reducers/graph.reducer';
import { selectColors, selectGraphLoadingState, selectModifiedGraph, selectSortedEdges, selectVertices } from 'src/app/selectors/graph.selectors';

@Component({
  selector: 'app-graph-scene',
  templateUrl: './graph-scene.component.html',
})
export class GraphSceneComponent{

  @ViewChild(SceneComponent) scene!: SceneComponent;

  constructor(
    private store$: Store<GraphState>
  ) { }

  public modifiedGraph$ = this.store$.select(selectModifiedGraph)
  public positions$ = this.store$.select(selectVertices);
  public colors$ = this.store$.select(selectColors);
  public getSortedEdges$ = this.store$.select(selectSortedEdges);
}
