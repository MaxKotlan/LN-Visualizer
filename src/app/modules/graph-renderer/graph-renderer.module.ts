import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AtftModule } from 'atft';
import { GraphNetworkingModule } from '../graph-networking/graph-networking.module';
import { GraphEdgeMeshComponent } from './components/graph-edge-mesh/graph-edge-mesh.component';
import { GraphFontMeshComponent } from './components/graph-font-mesh/graph-font-mesh.component';
import { GraphNodeMeshComponent } from './components/graph-node-mesh/graph-node-mesh.component';
import { GraphSceneComponent } from './components/graph-scene/graph-scene.component';
import {
    LndRaycasterCameraDirective,
    LndRaycasterEnableDirective,
    LndRaycasterSceneDirective,
} from './directives';
import { ChannelEffects, NodeEffects } from './effects';
import { graphStatisticsReducer, nodeStatisticsReducer, reducer } from './reducer';
import { ChannelColorService, GraphMeshStateService, LndRaycasterService } from './services';
import { ChannelBuffersService } from './services/channel-buffers/channel-buffers.service';
import { NodeBuffersService } from './services/node-buffers/node-buffers.service';

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
    providers: [
        LndRaycasterService,
        GraphMeshStateService,
        ChannelColorService,
        NodeBuffersService,
        ChannelBuffersService,
    ],
    imports: [
        CommonModule,
        AtftModule,
        GraphNetworkingModule,
        EffectsModule.forFeature([NodeEffects, ChannelEffects]),
        StoreModule.forFeature('graphState', reducer),
        StoreModule.forFeature('graphStatisticsState', graphStatisticsReducer.reducer),
        StoreModule.forFeature('nodeStatisticsState', nodeStatisticsReducer.reducer),
    ],
    exports: [GraphSceneComponent],
})
export class GraphRendererModule {}
