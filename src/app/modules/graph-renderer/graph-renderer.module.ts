import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AtftModule } from 'atft';
import { ChannelMeshModule } from '../channel-mesh/channel-mesh.module';
import { GraphNetworkingModule } from '../graph-networking/graph-networking.module';
import { NodeMeshModule } from '../node-mesh/node-mesh.module';
import { GraphFontMeshComponent } from './components/graph-font-mesh/graph-font-mesh.component';
import { GraphSceneComponent } from './components/graph-scene/graph-scene.component';
import { RaycasterRayComponent } from './components/raycaster-ray/raycaster-ray.component';
import {
    LndRaycasterCameraDirective,
    LndRaycasterEnableDirective,
    LndRaycasterSceneDirective,
} from './directives';
import { ChannelEffects, NodeEffects } from './effects';
import { ChannelMeshEffects } from './effects/channel-mesh.effects';
import { GraphDatabaseEffects } from './effects/graph-database.effects';
import { NodeMeshEffects } from './effects/node-mesh.effects';
import { NodeSearchEffects } from './effects/node-search.effects';
import { reducer } from './reducer';
import {
    CameraControllerService,
    ChannelColorService,
    LndRaycasterService,
    OrbitControllerService,
} from './services';
import { ChannelBuffersService } from './services/channel-buffers/channel-buffers.service';
import { NodeBuffersService } from './services/node-buffers/node-buffers.service';
import { GraphStatisticsModule } from '../graph-statistics';
import { ChannelThickMeshModule } from '../channel-mesh-thick/channel-mesh-thick.module';

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
        CameraControllerService,
        OrbitControllerService,
    ],
    imports: [
        CommonModule,
        AtftModule,
        GraphNetworkingModule,
        NodeMeshModule,
        ChannelMeshModule,
        ChannelThickMeshModule,
        GraphStatisticsModule,
        EffectsModule.forFeature([
            NodeEffects,
            ChannelEffects,
            NodeMeshEffects,
            ChannelMeshEffects,
            NodeSearchEffects,
            GraphDatabaseEffects,
        ]),
        StoreModule.forFeature('graphState', reducer),
    ],
    exports: [GraphSceneComponent],
})
export class GraphRendererModule {}
