import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AtftModule } from 'atft';
import { FilterTemplatesModule } from 'src/app/filter-engine/filter-templates/filter-templates.module';
import { GraphNetworkingModule } from 'src/app/graph-data/graph-networking/graph-networking.module';
import { GraphStatisticsModule } from 'src/app/graph-data/graph-statistics';
import { NodeFeaturesModule } from 'src/app/ui/node-features/node-features.module';
import { ChannelThickMeshModule } from '../channel-mesh-thick/channel-mesh-thick.module';
import { ChannelMeshModule } from '../channel-mesh/channel-mesh.module';
import { NodeMeshSphereModule } from '../node-mesh-sphere/node-mesh-sphere.module';
import { NodeMeshModule } from '../node-mesh/node-mesh.module';
import { GraphFontMeshComponent } from './components/graph-font-mesh/graph-font-mesh.component';
import { GraphSceneComponent } from './components/graph-scene/graph-scene.component';
import { RaycasterRayComponent } from './components/raycaster-ray/raycaster-ray.component';
import {
    LndRaycasterCameraDirective,
    LndRaycasterEnableDirective,
    LndRaycasterSceneDirective,
} from './directives';
import { ChannelMeshEffects } from './effects/channel-mesh.effects';
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
        NodeMeshSphereModule,
        ChannelMeshModule,
        ChannelThickMeshModule,
        GraphStatisticsModule,
        FilterTemplatesModule,
        NodeFeaturesModule,
        EffectsModule.forFeature([NodeMeshEffects, ChannelMeshEffects, NodeSearchEffects]),
        StoreModule.forFeature('graphState', reducer),
    ],
    exports: [GraphSceneComponent],
})
export class GraphRendererModule {}
