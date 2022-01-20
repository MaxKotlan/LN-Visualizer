import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { LndNodeWithPosition } from 'api/src/models/node-position.interface';
import { combineLatest, lastValueFrom, map, sampleTime, take, throttleTime } from 'rxjs';
import * as THREE from 'three';
import { GraphState } from '../reducers/graph.reducer';
import {
    graphSelector,
    selectChannelColorBuffer,
    selectChannelVertexBuffer,
    selectFinalMatcheNodesFromSearch,
    selectNodeColorBuffer,
    selectNodeSetKeyValue,
    selectNodeVertexBuffer,
} from '../selectors/graph.selectors';
import { BufferRef } from '../types/bufferRef.interface';

@Injectable()
export class GraphMeshStateService {
    constructor(private store$: Store<GraphState>) {}

    readonly throttleTimeMs: number = 500;

    nodeVertices$ = combineLatest([
        this.store$.select(graphSelector),
        this.store$.select(selectNodeVertexBuffer),
    ]).pipe(
        sampleTime(this.throttleTimeMs),
        map(([graphState, vertexBuffer]) => {
            if (!vertexBuffer || !graphState.nodeSet) return null;

            let i = 0;
            graphState.nodeSet.forEach((currentNode: LndNodeWithPosition) => {
                vertexBuffer[i * 3] = currentNode.position.x * 100;
                vertexBuffer[i * 3 + 1] = currentNode.position.y * 100;
                vertexBuffer[i * 3 + 2] = currentNode.position.z * 100;
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
        this.store$.select(graphSelector),
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

    channelVertices$ = combineLatest([
        this.store$.select(graphSelector),
        this.store$.select(selectChannelVertexBuffer),
        this.store$.select(selectNodeSetKeyValue),
        this.store$.select(selectFinalMatcheNodesFromSearch),
    ]).pipe(
        sampleTime(this.throttleTimeMs),
        map(([graphState, vertexBuffer, nodeRegistry, searchResult]) => {
            if (!vertexBuffer || !graphState.channelSet) return null;
            let dec = 0;
            let i = 0;
            graphState.channelSet.forEach((channel) => {
                if (
                    !(
                        !searchResult ||
                        (searchResult &&
                            (channel.policies[0].public_key === searchResult.public_key ||
                                channel.policies[1].public_key === searchResult.public_key))
                    )
                ) {
                    dec++;
                } else {
                    const node1 = nodeRegistry.get(channel.policies[0].public_key);
                    const node2 = nodeRegistry.get(channel.policies[1].public_key);
                    if (!node1 || !node2) {
                        dec++;
                    } else {
                        vertexBuffer[(i - dec) * 6] = node1.position.x * 100;
                        vertexBuffer[(i - dec) * 6 + 1] = node1.position.y * 100;
                        vertexBuffer[(i - dec) * 6 + 2] = node1.position.z * 100;
                        vertexBuffer[(i - dec) * 6 + 3] = node2.position.x * 100;
                        vertexBuffer[(i - dec) * 6 + 4] = node2.position.y * 100;
                        vertexBuffer[(i - dec) * 6 + 5] = node2.position.z * 100;
                    }
                }
                i++;
            });
            return {
                bufferRef: vertexBuffer,
                size: (graphState.channelSet.size - dec) * 2,
            } as BufferRef<Float32Array>;
        }),
    );

    channelColors$ = combineLatest([
        this.store$.select(graphSelector),
        this.store$.select(selectChannelColorBuffer),
        this.store$.select(selectNodeSetKeyValue),
        this.store$.select(selectFinalMatcheNodesFromSearch),
    ]).pipe(
        sampleTime(this.throttleTimeMs),
        map(([graphState, colorBuffer, nodeRegistry, searchResult]) => {
            if (!colorBuffer || !graphState.channelSet) return null;
            let dec = 0;
            let i = 0;
            graphState.channelSet.forEach((channel) => {
                if (
                    !(
                        !searchResult ||
                        (searchResult &&
                            (channel.policies[0].public_key === searchResult.public_key ||
                                channel.policies[1].public_key === searchResult.public_key))
                    )
                ) {
                    dec++;
                } else {
                    const node1 = nodeRegistry.get(channel.policies[0].public_key);
                    const node2 = nodeRegistry.get(channel.policies[1].public_key);
                    if (!node1 || !node2) {
                        dec++;
                    } else {
                        const color1 = this.fromHexString(node1.color);
                        const color2 = this.fromHexString(node2.color);

                        colorBuffer[(i - dec) * 6] = color1[0];
                        colorBuffer[(i - dec) * 6 + 1] = color1[1];
                        colorBuffer[(i - dec) * 6 + 2] = color1[2];
                        colorBuffer[(i - dec) * 6 + 3] = color2[0];
                        colorBuffer[(i - dec) * 6 + 4] = color2[1];
                        colorBuffer[(i - dec) * 6 + 5] = color2[2];
                    }
                }
                i++;
            });
            return {
                bufferRef: colorBuffer,
                size: (graphState.channelSet.size - dec) * 2,
            } as BufferRef<Uint8Array>;
        }),
    );
}
