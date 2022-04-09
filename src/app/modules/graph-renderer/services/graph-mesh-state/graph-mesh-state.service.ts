import { Injectable } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatest, map, sampleTime, withLatestFrom } from 'rxjs';
import {
    channelColor,
    channelColorMap,
    selectUseLogColorScale,
} from 'src/app/modules/controls-channel/selectors';
import { FilterEvaluatorService } from 'src/app/modules/controls-graph-filter/services/filter-evaluator.service';
import { LndNodeWithPosition } from 'src/app/types/node-position.interface';
import { meshScale } from '../../../../constants/mesh-scale.constant';
import { BufferRef } from '../../../../types/bufferRef.interface';
import * as filterSelectors from '../../../controls-graph-filter/selectors/filter.selectors';
import { setFilteredNodeChannels, setFilteredNodes } from '../../actions/graph.actions';
import { GraphState } from '../../reducer/graph.reducer';
import { selectMinMax } from '../../selectors';
import {
    selectChannelColorBuffer,
    selectChannelVertexBuffer,
} from '../../selectors/graph.selectors';
import { ChannelColorService } from '../channel-color';
import { NodeBuffersService } from '../node-buffers/node-buffers.service';

@Injectable()
export class GraphMeshStateService {
    constructor(
        private store$: Store<GraphState>,
        private actions$: Actions,
        private channelColorService: ChannelColorService,
        private filterEvaluationService: FilterEvaluatorService,
        private nodeBuffersService: NodeBuffersService,
    ) {
        this.nodeVertices$.subscribe();
        this.nodeColors$.subscribe();
        this.nodeCapacity$.subscribe();
    }

    readonly throttleTimeMs: number = 500;

    nodeVertices$ = this.actions$.pipe(ofType(setFilteredNodes)).pipe(
        sampleTime(this.throttleTimeMs),
        map((graphState) => {
            if (!this.nodeBuffersService.vertex || !graphState.nodeSet) return null;

            let i = 0;
            graphState.nodeSet.forEach((currentNode: LndNodeWithPosition) => {
                this.nodeBuffersService.vertex.data[i * 3] = currentNode.position.x * meshScale;
                this.nodeBuffersService.vertex.data[i * 3 + 1] = currentNode.position.y * meshScale;
                this.nodeBuffersService.vertex.data[i * 3 + 2] = currentNode.position.z * meshScale;
                i++;
            });

            this.nodeBuffersService.vertex.onUpdate.next();
        }),
    );

    private fromHexString = (hexString: string) => [
        parseInt(hexString[1] + hexString[2], 16),
        parseInt(hexString[3] + hexString[4], 16),
        parseInt(hexString[5] + hexString[6], 16),
    ];

    nodeColors$ = this.actions$.pipe(ofType(setFilteredNodes)).pipe(
        sampleTime(this.throttleTimeMs),
        map((graphState) => {
            if (!this.nodeBuffersService.color || !graphState.nodeSet) return null;

            let i = 0;
            graphState.nodeSet.forEach((currentNode) => {
                const color = this.fromHexString(currentNode.color);
                this.nodeBuffersService.color.data[i * 3] = color[0];
                this.nodeBuffersService.color.data[i * 3 + 1] = color[1];
                this.nodeBuffersService.color.data[i * 3 + 2] = color[2];
                i++;
            });

            this.nodeBuffersService.color.onUpdate.next();
        }),
    );

    nodeCapacity$ = combineLatest([
        this.actions$.pipe(ofType(setFilteredNodes)),
        this.store$.select(selectMinMax('node_capacity')),
    ]).pipe(
        sampleTime(this.throttleTimeMs),
        map(([graphState, minMaxNodeCapacity]) => {
            if (!this.nodeBuffersService.capacity || !graphState.nodeSet) return null;

            let i = 0;
            graphState.nodeSet.forEach((currentNode: LndNodeWithPosition) => {
                this.nodeBuffersService.capacity.data[i] = Math.sqrt(
                    currentNode.node_capacity / minMaxNodeCapacity.max,
                );
                i++;
            });

            this.nodeBuffersService.capacity.onUpdate.next();
        }),
    );

    channelVertices$ = combineLatest([
        this.store$.select(filterSelectors.activeChannelFilters),
        this.actions$.pipe(ofType(setFilteredNodeChannels)),
        this.store$.select(selectChannelVertexBuffer),
        this.actions$.pipe(ofType(setFilteredNodes)),
    ]).pipe(
        sampleTime(this.throttleTimeMs),
        map(([filters, graphState, vertexBuffer, nodeRegistry]) => {
            if (!vertexBuffer || !graphState.channelSet) return null;
            let i = 0;
            graphState.channelSet.forEach((channel) => {
                if (this.filterEvaluationService.evaluateFilters(channel, filters)) {
                    const node1 = nodeRegistry.nodeSet.get(channel.policies[0].public_key);
                    const node2 = nodeRegistry.nodeSet.get(channel.policies[1].public_key);
                    if (node1 && node2) {
                        vertexBuffer[i * 6] = node1.position.x * meshScale;
                        vertexBuffer[i * 6 + 1] = node1.position.y * meshScale;
                        vertexBuffer[i * 6 + 2] = node1.position.z * meshScale;
                        vertexBuffer[i * 6 + 3] = node2.position.x * meshScale;
                        vertexBuffer[i * 6 + 4] = node2.position.y * meshScale;
                        vertexBuffer[i * 6 + 5] = node2.position.z * meshScale;
                        i++;
                    }
                }
            });
            return {
                bufferRef: vertexBuffer,
                size: i * 2,
            } as BufferRef<Float32Array>;
        }),
    );

    channelColors$ = combineLatest([
        this.store$.select(filterSelectors.activeChannelFilters),
        this.actions$.pipe(ofType(setFilteredNodeChannels)),
        this.store$.select(selectChannelColorBuffer),
        this.actions$.pipe(ofType(setFilteredNodes)),
        this.store$.select(channelColor),
        this.store$.select(channelColorMap),
        this.store$.select(selectUseLogColorScale),
    ]).pipe(
        sampleTime(this.throttleTimeMs),
        map(([filters, graphState, colorBuffer, nodeRegistry]) => {
            if (!colorBuffer || !graphState.channelSet) return null;
            let i = 0;
            graphState.channelSet.forEach((channel) => {
                if (this.filterEvaluationService.evaluateFilters(channel, filters)) {
                    const node1 = nodeRegistry.nodeSet.get(channel.policies[0].public_key);
                    const node2 = nodeRegistry.nodeSet.get(channel.policies[1].public_key);
                    if (node1 && node2) {
                        const color = this.channelColorService.map(node1, node2, channel);

                        colorBuffer[i * 6] = color[0];
                        colorBuffer[i * 6 + 1] = color[1];
                        colorBuffer[i * 6 + 2] = color[2];
                        colorBuffer[i * 6 + 3] = color[3];
                        colorBuffer[i * 6 + 4] = color[4];
                        colorBuffer[i * 6 + 5] = color[5];
                        i++;
                    }
                }
            });
            return {
                bufferRef: colorBuffer,
                size: i * 2,
            } as BufferRef<Uint8Array>;
        }),
    );

    channelData$ = this.channelColors$.pipe(withLatestFrom(this.channelVertices$));
}
