import {
    Component,
    EventEmitter,
    OnChanges,
    OnDestroy,
    OnInit,
    Optional,
    Output,
    SkipSelf,
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
    AbstractObject3D,
    provideParent,
    RaycasterEmitEvent,
    RaycasterEvent,
    RendererService,
    SphereMeshComponent,
} from 'atft';
import { searchGraph } from 'src/app/ui/settings/controls/actions/controls.actions';
import { ToolTipService } from 'src/app/ui/misc/services/tooltip.service';
import * as THREE from 'three';
import { Vector3 } from 'three';
import { GraphState } from 'src/app/renderer/graph-renderer/reducer';
import { LndRaycasterService } from 'src/app/renderer/graph-renderer/services';
import { PointTreeService } from 'src/app/graph-data/data-registries/services/point-tree';
import { NodeGeometry } from '../geometry/node-geometry.service';
import { NodeMaterial } from '../material/node-material.service';
import { NodePositionOffsetService, NodeSizeOffsetService } from '../services';
import { NodePoint } from '../three-js-objects/NodePoint';

@Component({
    selector: 'app-nodes-object',
    providers: [provideParent(SphereMeshComponent)],
    template: '<ng-content></ng-content>',
})
export class NodesObjectComponent
    extends AbstractObject3D<NodePoint>
    implements OnChanges, OnInit, OnDestroy
{
    @Output() mouseEnter = new EventEmitter<RaycasterEmitEvent>();
    @Output() mouseExit = new EventEmitter<RaycasterEmitEvent>();
    // eslint-disable-next-line @angular-eslint/no-output-native
    @Output() click = new EventEmitter<RaycasterEmitEvent>();

    constructor(
        protected override rendererService: RendererService,
        @SkipSelf() @Optional() protected override parent: AbstractObject3D<any>,
        private raycasterService: LndRaycasterService,
        private store$: Store<GraphState>,
        public toolTipService: ToolTipService,
        private nodeGeometry: NodeGeometry,
        private nodeMaterial: NodeMaterial,
        private pointTreeService: PointTreeService,
        private nodePositionOffsetSevice: NodePositionOffsetService,
        private nodeSizeOffsetService: NodeSizeOffsetService,
    ) {
        super(rendererService, parent);
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.raycasterService.addGroup(this);
        this.subscribeEvents();
    }

    override ngOnDestroy(): void {
        this.unsubscribeEvents();
        super.ngOnDestroy();
    }

    private subscribeEvents() {
        this.object.addEventListener(RaycasterEvent.mouseEnter, this.onMouseEnter.bind(this));
        this.object.addEventListener(RaycasterEvent.mouseExit, this.onMouseExit.bind(this));
        this.object.addEventListener(RaycasterEvent.click, this.onClick.bind(this));
    }

    private unsubscribeEvents() {
        this.object.removeEventListener(RaycasterEvent.mouseEnter, this.onMouseEnter.bind(this));
        this.object.removeEventListener(RaycasterEvent.mouseExit, this.onMouseExit.bind(this));
        this.object.removeEventListener(RaycasterEvent.click, this.onClick.bind(this));
    }

    private onMouseExit() {
        this.nodeMaterial.handleHoverUpdate(new Vector3(0, 0, 0));
        this.toolTipService.close();
        document.body.style.cursor = null as unknown as string;
    }

    private onMouseEnter(event: any) {
        document.body.style.cursor = 'pointer';
        const intersection = event as THREE.Intersection;
        const node = this.pointTreeService.getNearestNeighbor(intersection.point);
        if (!node) return;
        this.nodeMaterial.handleHoverUpdate(node.position);
        this.toolTipService.open(event.mouseEvent.clientX, event.mouseEvent.clientY, node.alias);
    }

    private onClick(event: any) {
        const intersection = event as THREE.Intersection;
        const node = this.pointTreeService.getNearestNeighbor(intersection.point);
        if (!node) return;
        this.toolTipService.close();
        this.store$.dispatch(
            searchGraph({ searchText: node.public_key, shouldUpdateSearchBar: true }),
        );
    }

    protected newObject3DInstance(): NodePoint {
        const mesh = new NodePoint(
            this.nodePositionOffsetSevice,
            this.nodeSizeOffsetService,
            this.nodeGeometry,
            this.nodeMaterial,
        );
        this.object = mesh;
        this.nodeMaterial.handleHoverUpdate(new Vector3(0, 0, 0));
        return mesh;
    }
}
