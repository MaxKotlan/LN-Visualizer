import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AtftModule } from 'atft';
import { GraphNetworkingModule } from '../graph-networking/graph-networking.module';
import { GraphFontMeshComponent } from './components/graph-font-mesh/graph-font-mesh.component';
import { GraphSceneComponent } from './components/graph-scene/graph-scene.component';
import {
    LndRaycasterCameraDirective,
    LndRaycasterEnableDirective,
    LndRaycasterSceneDirective,
} from './directives';
import { ChannelEffects, NodeEffects } from './effects';
import { graphStatisticsReducer, nodeStatisticsReducer, reducer } from './reducer';
import { ChannelColorService, LndRaycasterService } from './services';
import { ChannelBuffersService } from './services/channel-buffers/channel-buffers.service';
import { NodeBuffersService } from './services/node-buffers/node-buffers.service';
import { RaycasterRayComponent } from './components/raycaster-ray/raycaster-ray.component';
import { NodeMeshEffects } from './effects/node-mesh.effects';
import { ChannelMeshEffects } from './effects/channel-mesh.effects';
import { NodeMeshModule } from '../node-mesh/node-mesh.module';
import { ChannelMeshModule } from '../channel-mesh/channel-mesh.module';
import { NodeSearchEffects } from './effects/node-search.effects';
import { GraphDatabaseEffects } from './effects/graph-database.effects';

@NgModule({
    declarations: [
        GraphSceneComponent,
        GraphFontMeshComponent,
        LndRaycasterEnableDirective,
        LndRaycasterCameraDirective,
        LndRaycasterSceneDirective,
        RaycasterRayComponent,
    ],
    providers: [
        LndRaycasterService,
        ChannelColorService,
        NodeBuffersService,
        ChannelBuffersService,
    ],
    imports: [
        CommonModule,
        AtftModule,
        GraphNetworkingModule,
        NodeMeshModule,
        ChannelMeshModule,
        EffectsModule.forFeature([
            NodeEffects,
            ChannelEffects,
            NodeMeshEffects,
            ChannelMeshEffects,
            NodeSearchEffects,
            GraphDatabaseEffects,
        ]),
        StoreModule.forFeature('graphState', reducer),
        StoreModule.forFeature('graphStatisticsState', graphStatisticsReducer.reducer),
        StoreModule.forFeature('nodeStatisticsState', nodeStatisticsReducer.reducer),
    ],
    exports: [GraphSceneComponent],
})
export class GraphRendererModule {}
