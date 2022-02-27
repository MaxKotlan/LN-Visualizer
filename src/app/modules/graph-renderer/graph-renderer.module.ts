import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AtftModule } from 'atft';
import { GraphEdgeMeshComponent } from './components/graph-edge-mesh/graph-edge-mesh.component';
import { GraphFontMeshComponent } from './components/graph-font-mesh/graph-font-mesh.component';
import { GraphNodeMeshComponent } from './components/graph-node-mesh/graph-node-mesh.component';
import { GraphSceneComponent } from './components/graph-scene/graph-scene.component';
import {
    LndRaycasterCameraDirective,
    LndRaycasterEnableDirective,
    LndRaycasterSceneDirective,
} from './directives';
import { GraphEffects } from './effects';
import { reducer } from './reducer';
import { GraphMeshStateService, LndRaycasterService } from './services';

@NgModule({
    declarations: [
        GraphSceneComponent,
        GraphEdgeMeshComponent,
        GraphNodeMeshComponent,
        GraphFontMeshComponent,
        LndRaycasterEnableDirective,
        LndRaycasterCameraDirective,
        LndRaycasterSceneDirective,
    ],
    providers: [LndRaycasterService, GraphMeshStateService],
    imports: [
        CommonModule,
        AtftModule,
        EffectsModule.forFeature([GraphEffects]),
        StoreModule.forFeature('graphState', reducer),
    ],
    exports: [GraphSceneComponent],
})
export class GraphRendererModule {}