import { Injectable } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatest, map, sampleTime, withLatestFrom } from 'rxjs';
import { LndNodeWithPosition } from 'src/app/types/node-position.interface';
import { cacheProcessedChannelChunk, cacheProcessedGraphNodeChunk } from '../actions/graph.actions';
import { meshScale } from '../constants/mesh-scale.constant';
import { GraphState } from '../reducers/graph.reducer';
import { capacityFilterAmount, capacityFilterEnable } from '../selectors/controls.selectors';
import {
    selectChannelColorBuffer,
    selectChannelVertexBuffer,
    selectFinalMatcheNodesFromSearch,
    selectNodeCapacityBuffer,
    selectNodeColorBuffer,
    selectNodeVertexBuffer,
} from '../selectors/graph.selectors';
import { BufferRef } from '../types/bufferRef.interface';

@Injectable()
export class GraphMeshStateService {
    constructor(private store$: Store<GraphState>, private actions$: Actions) {}

    readonly throttleTimeMs: number = 500;

    nodeVertices$ = combineLatest([
        this.actions$.pipe(ofType(cacheProcessedGraphNodeChunk)),
        this.store$.select(selectNodeVertexBuffer),
    ]).pipe(
        sampleTime(this.throttleTimeMs),
        map(([graphState, vertexBuffer]) => {
            if (!vertexBuffer || !graphState.nodeSet) return null;

            let i = 0;
            graphState.nodeSet.forEach((currentNode: LndNodeWithPosition) => {
                vertexBuffer[i * 3] = currentNode.position.x * meshScale;
                vertexBuffer[i * 3 + 1] = currentNode.position.y * meshScale;
                vertexBuffer[i * 3 + 2] = currentNode.position.z * meshScale;
                i++;
            });

            return {
                bufferRef: vertexBuffer,
                size: graphState.nodeSet.size,
            } as BufferRef<Float32Array>;
        }),
    );

    private fromHexString = (hexString: string) => [
        parseInt(hexString[1] + hexString[2], 16),
        parseInt(hexString[3] + hexString[4], 16),
        parseInt(hexString[5] + hexString[6], 16),
    ];

    nodeColors$ = combineLatest([
        this.actions$.pipe(ofType(cacheProcessedGraphNodeChunk)),
        this.store$.select(selectNodeColorBuffer),
    ]).pipe(
        sampleTime(this.throttleTimeMs),
        map(([graphState, colorBuffer]) => {
            if (!colorBuffer || !graphState.nodeSet) return null;
            let i = 0;
            graphState.nodeSet.forEach((currentNode) => {
                const color = this.fromHexString(currentNode.color);
                colorBuffer[i * 3] = color[0];
                colorBuffer[i * 3 + 1] = color[1];
                colorBuffer[i * 3 + 2] = color[2];
                i++;
            });
            return {
                bufferRef: colorBuffer,
                size: graphState.nodeSet.size,
            } as BufferRef<Uint8Array>;
        }),
    );

    nodeCapacity$ = combineLatest([
        this.actions$.pipe(ofType(cacheProcessedGraphNodeChunk)),
        this.store$.select(selectNodeCapacityBuffer),
    ]).pipe(
        sampleTime(this.throttleTimeMs),
        map(([graphState, capacityBuffer]) => {
            if (!capacityBuffer || !graphState.nodeSet) return null;

            let i = 0;
            let largestCapacity = 0;
            // let averageNetworkCapacity = 0;
            graphState.nodeSet.forEach((currentNode: LndNodeWithPosition) => {
                if (currentNode.totalCapacity > largestCapacity)
                    largestCapacity = currentNode.totalCapacity;
                // averageNetworkCapacity += currentNode.totalCapacity;
                i++;
            });
            // averageNetworkCapacity /= i;
            // i = 0;
            // let variance = 0;
            // graphState.nodeSet.forEach((currentNode: LndNodeWithPosition) => {
            //     variance +=
            //         (currentNode.totalCapacity - averageNetworkCapacity) *
            //         (currentNode.totalCapacity - averageNetworkCapacity);
            //     i++;
            // });
            // let std = Math.sqrt(variance / i);
            // console.log(std);
            i = 0;
            graphState.nodeSet.forEach((currentNode: LndNodeWithPosition) => {
                capacityBuffer[i] =
                    Math.sqrt(currentNode.totalCapacity) / Math.sqrt(largestCapacity); //(currentNode.totalCapacity - averageNetworkCapacity) / std;
                // if (currentNode.alias === 'zion-c58d643b-m')
                //     console.log('"zion-c58d643b-m"', capacityBuffer[i]);
                // if (currentNode.alias === 'Libertas a Ripas')
                //     console.log('"Libertas a Ripas"', capacityBuffer[i]);
                // if (currentNode.alias === 'ACINQ') console.log('ACINQ', capacityBuffer[i]);

                i++;
            });
            // console.log(capacityBuffer);

            return {
                bufferRef: capacityBuffer,
                size: graphState.nodeSet.size,
            } as BufferRef<Float32Array>;
        }),
    );

    channelVertices$ = combineLatest([
        this.actions$.pipe(ofType(cacheProcessedChannelChunk)),
        this.store$.select(selectChannelVertexBuffer),
        this.actions$.pipe(ofType(cacheProcessedGraphNodeChunk)),
        this.store$.select(selectFinalMatcheNodesFromSearch),
        this.store$.select(capacityFilterEnable),
        this.store$.select(capacityFilterAmount),
    ]).pipe(
        sampleTime(this.throttleTimeMs),
        map(
            ([
                graphState,
                vertexBuffer,
                nodeRegistry,
                searchResult,
                capacityFilterEnabled,
                capacityFilterAmount,
            ]) => {
                if (!vertexBuffer || !graphState.channelSet) return null;
                let i = 0;
                graphState.channelSet.forEach((channel) => {
                    if (
                        this.shouldRenderChannel(
                            searchResult,
                            channel,
                            capacityFilterAmount,
                            capacityFilterEnabled,
                        )
                    ) {
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
            },
        ),
    );

    channelColors$ = combineLatest([
        this.actions$.pipe(ofType(cacheProcessedChannelChunk)),
        this.store$.select(selectChannelColorBuffer),
        this.actions$.pipe(ofType(cacheProcessedGraphNodeChunk)),
        this.store$.select(selectFinalMatcheNodesFromSearch),
        this.store$.select(capacityFilterEnable),
        this.store$.select(capacityFilterAmount),
    ]).pipe(
        sampleTime(this.throttleTimeMs),
        map(
            ([
                graphState,
                colorBuffer,
                nodeRegistry,
                searchResult,
                capacityFilterEnabled,
                capacityFilterAmount,
            ]) => {
                if (!colorBuffer || !graphState.channelSet) return null;
                let i = 0;
                graphState.channelSet.forEach((channel) => {
                    if (
                        this.shouldRenderChannel(
                            searchResult,
                            channel,
                            capacityFilterAmount,
                            capacityFilterEnabled,
                        )
                    ) {
                        const node1 = nodeRegistry.nodeSet.get(channel.policies[0].public_key);
                        const node2 = nodeRegistry.nodeSet.get(channel.policies[1].public_key);
                        if (node1 && node2) {
                            const color1 = this.fromHexString(node1.color);
                            const color2 = this.fromHexString(node2.color);

                            colorBuffer[i * 6] = color1[0];
                            colorBuffer[i * 6 + 1] = color1[1];
                            colorBuffer[i * 6 + 2] = color1[2];
                            colorBuffer[i * 6 + 3] = color2[0];
                            colorBuffer[i * 6 + 4] = color2[1];
                            colorBuffer[i * 6 + 5] = color2[2];
                            i++;
                        }
                    }
                });
                return {
                    bufferRef: colorBuffer,
                    size: i * 2,
                } as BufferRef<Uint8Array>;
            },
        ),
    );

    public shouldRenderChannel(
        searchResult: LndNodeWithPosition,
        channel,
        capacityFilterAmount: number,
        capacityFilterEnabled: boolean,
    ): boolean {
        return (
            (!searchResult ||
                (searchResult &&
                    (channel.policies[0].public_key === searchResult.public_key ||
                        channel.policies[1].public_key === searchResult.public_key))) &&
            ((capacityFilterEnabled && channel.capacity >= capacityFilterAmount) ||
                !capacityFilterEnabled)
        );
    }

    channelData$ = this.channelColors$.pipe(withLatestFrom(this.channelVertices$));
}
