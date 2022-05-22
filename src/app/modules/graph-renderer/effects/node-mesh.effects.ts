import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { sampleTime, map, combineLatest } from 'rxjs';
import { meshScale } from 'src/app/constants/mesh-scale.constant';
import { LndNodeWithPosition } from 'src/app/types/node-position.interface';
import { selectMinMax } from '../../graph-statistics/selectors';
import { setFilteredNodes } from '../actions';
import { GraphState } from '../reducer';
import { FilteredNodeRegistryService } from '../services/filtered-node-registry/filtered-node-registry.service';
import { NodeBuffersService } from '../services/node-buffers/node-buffers.service';

@Injectable()
export class NodeMeshEffects {
    constructor(
        private store$: Store<GraphState>,
        private actions$: Actions,
        private nodeBuffersService: NodeBuffersService,
        private filteredNodeRegistry: FilteredNodeRegistryService,
    ) {}

    readonly throttleTimeMs: number = 500;

    nodeVertices$ = createEffect(
        () =>
            this.actions$.pipe(ofType(setFilteredNodes)).pipe(
                sampleTime(this.throttleTimeMs),
                map(() => {
                    if (!this.nodeBuffersService.vertex || !this.filteredNodeRegistry) return null;

                    let i = 0;
                    this.filteredNodeRegistry.forEach((currentNode: LndNodeWithPosition) => {
                        this.nodeBuffersService.vertex.data[i * 3] =
                            currentNode.position.x * meshScale;
                        this.nodeBuffersService.vertex.data[i * 3 + 1] =
                            currentNode.position.y * meshScale;
                        this.nodeBuffersService.vertex.data[i * 3 + 2] =
                            currentNode.position.z * meshScale;
                        i++;
                    });

                    this.nodeBuffersService.vertex.onUpdate.next(i);
                }),
            ),
        { dispatch: false },
    );

    private fromHexString = (hexString: string) => [
        parseInt(hexString[1] + hexString[2], 16),
        parseInt(hexString[3] + hexString[4], 16),
        parseInt(hexString[5] + hexString[6], 16),
    ];

    nodeColors$ = createEffect(
        () =>
            this.actions$.pipe(ofType(setFilteredNodes)).pipe(
                sampleTime(this.throttleTimeMs),
                map(() => {
                    if (!this.nodeBuffersService.color || !this.filteredNodeRegistry) return null;

                    let i = 0;
                    this.filteredNodeRegistry.forEach((currentNode) => {
                        const color = this.fromHexString(currentNode.color);
                        this.nodeBuffersService.color.data[i * 3] = color[0];
                        this.nodeBuffersService.color.data[i * 3 + 1] = color[1];
                        this.nodeBuffersService.color.data[i * 3 + 2] = color[2];
                        i++;
                    });

                    this.nodeBuffersService.color.onUpdate.next(i);
                }),
            ),
        { dispatch: false },
    );

    nodeCapacity$ = createEffect(
        () =>
            combineLatest([
                this.actions$.pipe(ofType(setFilteredNodes)),
                this.store$.select(selectMinMax('node_capacity')),
            ]).pipe(
                sampleTime(this.throttleTimeMs),
                map(([, minMaxNodeCapacity]) => {
                    if (!this.nodeBuffersService.capacity || !this.filteredNodeRegistry)
                        return null;

                    let i = 0;
                    this.filteredNodeRegistry.forEach((currentNode: LndNodeWithPosition) => {
                        this.nodeBuffersService.capacity.data[i] = Math.sqrt(
                            currentNode.node_capacity / minMaxNodeCapacity.max,
                        );
                        i++;
                    });

                    this.nodeBuffersService.capacity.onUpdate.next(i);
                }),
            ),
        { dispatch: false },
    );
}
