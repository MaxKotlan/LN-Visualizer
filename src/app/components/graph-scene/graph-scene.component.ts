import { Component, OnInit, ViewChild } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { SceneComponent } from 'atft';
import { combineLatest, combineLatestWith, filter, map, Observable } from 'rxjs';
import { gotoNode } from 'src/app/actions/graph.actions';
import { GraphState } from 'src/app/reducers/graph.reducer';
import { selectAliases, selectColors, selectEdgeColor, selectEdgeVertices, selectFinalMatcheNodesFromSearch, selectModifiedGraph, selectSortedEdges, selectVertices, shouldRenderEdges } from 'src/app/selectors/graph.selectors';
import * as THREE from 'three';

@Component({
  selector: 'app-graph-scene',
  templateUrl: './graph-scene.component.html',
})
export class GraphSceneComponent implements OnInit{

  @ViewChild(SceneComponent) scene!: SceneComponent;

  constructor(
    private store$: Store<GraphState>,
    private actions$: Actions
  ) { }

  public modifiedGraph$ = this.store$.select(selectModifiedGraph)
  public positions$ = this.store$.select(selectVertices);
  public colors$ = this.store$.select(selectColors);
  public getSortedEdges$ = this.store$.select(selectSortedEdges);
  public shouldRenderEdges$ = this.store$.select(shouldRenderEdges);
  public selectEdgeColor$ = this.store$.select(selectEdgeColor);
  public selectAliases$ = this.store$.select(selectAliases);
  public selectEdgeVertices$ = this.store$.select(selectEdgeVertices);
  
  public gotoCoordinates$: Observable<THREE.Vector3> = 
    this.actions$.pipe(
      ofType(gotoNode),
      combineLatestWith(this.store$.select(selectFinalMatcheNodesFromSearch)),
      map(([,node]) => node?.postition),
      filter((pos) => !!pos),
      map((pos) => new THREE.Vector3(pos?.x, pos?.y, pos?.z).multiplyScalar(100)),
    );
  
  public gotoCoordinates: THREE.Vector3 = new THREE.Vector3(0,0,0);

  ngOnInit(): void {
    //this isnt working
    //this.gotoCoordinates$.subscribe(coordinates => this.gotoCoordinates = coordinates);
  }
}
