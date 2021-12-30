import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { PerspectiveCameraComponent, SceneComponent } from 'atft';
import { combineLatestWith, filter, map, Observable } from 'rxjs';
import { gotoNode } from 'src/app/actions/controls.actions';
import { GraphState } from 'src/app/reducers/graph.reducer';
import { selectCameraFov, selectEdgeDepthTest, selectEdgeDottedLine, selectNodeSize, selectPointAttenuation, selectPointUseIcon, shouldRenderEdges, shouldRenderLabels, shouldRenderNodes } from 'src/app/selectors/controls.selectors';
import { selectAliases, selectColors, selectEdgeColor, selectEdgeVertices, selectFinalMatcheNodesFromSearch, selectModifiedGraph, selectSortedEdges, selectVertices } from 'src/app/selectors/graph.selectors';
import * as THREE from 'three';

@Component({
  selector: 'app-graph-scene',
  templateUrl: './graph-scene.component.html',
})
export class GraphSceneComponent implements AfterViewInit{

  @ViewChild(SceneComponent) scene!: SceneComponent;
  @ViewChild(PerspectiveCameraComponent) cameraComponent: PerspectiveCameraComponent | undefined;

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
  public selectNodeSize$ = this.store$.select(selectNodeSize);
  public selectPointAttenuation$ = this.store$.select(selectPointAttenuation);
  public selectPointUseIcon$ = this.store$.select(selectPointUseIcon);
  public shouldRenderLabels$ = this.store$.select(shouldRenderLabels);
  public shouldRenderNodes$ = this.store$.select(shouldRenderNodes);
  public selectCameraFov$ = this.store$.select(selectCameraFov);
  public selectEdgeDepthTest$ = this.store$.select(selectEdgeDepthTest);
  public selectEdgeDottedLine$ = this.store$.select(selectEdgeDottedLine);

  public gotoCoordinates$: Observable<THREE.Vector3> = 
    this.actions$.pipe(
      ofType(gotoNode),
      combineLatestWith(this.store$.select(selectFinalMatcheNodesFromSearch)),
      map(([,node]) => node?.postition),
      filter((pos) => !!pos),
      map((pos) => new THREE.Vector3(pos?.x, pos?.y, pos?.z).multiplyScalar(100)),
    );

  public ngAfterViewInit(){
    this.gotoCoordinates$.subscribe(coordinates => {
      if (!this.cameraComponent) return;
      this.cameraComponent.positionX = coordinates.x;
      this.cameraComponent.positionY = coordinates.y;
      this.cameraComponent.positionZ = coordinates.z;

      console.log(this.cameraComponent?.camera)
    })
  }
}
