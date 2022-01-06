import { createReducer, on } from '@ngrx/store';
import { LnGraph, LnGraphEdge, LnGraphNode, LnModifiedGraphNode } from '../types/graph.interface';
import * as graphActions from '../actions/graph.actions';
import * as THREE from 'three';
import { Vector3 } from 'three';
import { HttpErrorResponse } from '@angular/common/http';
import { LndNode } from 'api/src/models';
import { LndChannel } from '../types/channels.interface';
import * as seedRandom from 'seedrandom';
import { ChunkInfo } from 'api/src/models/chunkInfo.interface';
import { LndNodeWithPosition } from 'api/src/models/node-position.interface';

type PublicKey = string;

export interface GraphState {
    chunkInfo: ChunkInfo | null;
    graphUnsorted: LnGraph;
    nodeList: LnGraphNode[];
    edgeList: LnGraphEdge[];
    modifiedGraph: Record<PublicKey, LnModifiedGraphNode>;
    isLoading: boolean;
    error: HttpErrorResponse | undefined;
    nodeChunksProcessed: number;
    channelChunksProcessed: number;
    nodeVertexBuffer: Float32Array | null;

    nodeSet: Record<string, LndNodeWithPosition>;
}

const initialState: GraphState = {
    graphUnsorted: { nodes: [], edges: [] },
    modifiedGraph: {},
    nodeList: [],
    edgeList: [],
    isLoading: false,
    error: undefined,
    chunkInfo: null,
    nodeChunksProcessed: 0,
    channelChunksProcessed: 0,
    nodeVertexBuffer: null,
    nodeSet: {},
};

const hotFixMapper = (node: LndNode) => {
    return {
        pub_key: node.public_key,
        color: node.color,
        alias: node.alias,
    } as LnGraphNode;
};

const hotFixMapper2 = (channel: LndChannel) => {
    return {
        node1_pub: channel.policies[0].public_key,
        node2_pub: channel.policies[1].public_key,
        capacity: channel.capacity.toString(),
    } as unknown as LnGraphEdge;
};

//Allocate 10% extra buffer space
const bufferOverheadStorage = 1.1;

export const reducer = createReducer(
    initialState,
    on(graphActions.processChunkInfo, (state, { chunkInfo }) => ({
        ...state,
        chunkInfo,
        nodeVertexBuffer: new Float32Array(Math.floor(chunkInfo.nodes * bufferOverheadStorage) * 3),
    })),
    on(graphActions.cacheProcessedGraphNodeChunk, (state, { nodeSet }) => ({
        ...state,
        nodeSet: { ...state.nodeSet, ...nodeSet },
    })),
    on(graphActions.requestGraph, (state) => ({ ...state, error: undefined, isLoading: true })),
    // on(graphActions.processGraphNodeChunk, (state, { chunk }) => {
    //     const t0 = performance.now();
    //     const currentNodeState = [...state.nodeList, ...chunk.data.map(hotFixMapper)];
    //     const result = {
    //         ...state,
    //         nodeList: currentNodeState,
    //         nodeChunksProcessed: state.nodeChunksProcessed + 1,
    //         modifiedGraph: getModifiedGraph(currentNodeState, getNodeEdgeArray(state.edgeList)),
    //     };
    //     const t1 = performance.now();
    //     //console.log(`Call to compute nodes took ${t1 - t0} milliseconds.`);
    //     return result;
    // }),
    // on(graphActions.processGraphChannelChunk, (state, { chunk }) => {
    //     const t0 = performance.now();
    //     const currentChannelState = [
    //         ...state.edgeList,
    //         ...chunk.data.map((chunk) => hotFixMapper2(chunk)),
    //     ];
    //     const result = {
    //         ...state,
    //         edgeList: currentChannelState,
    //         channelChunksProcessed: state.channelChunksProcessed + 1,
    //         modifiedGraph: getModifiedGraph(state.nodeList, getNodeEdgeArray(currentChannelState)),
    //     };
    //     const t1 = performance.now();
    //     //console.log(`Call to compute edges took ${t1 - t0} milliseconds.`);
    //     return result;
    // }),
    // on(graphActions.requestGraphSuccess, (state, { graph }) => ({
    //     ...state,
    //     graphUnsorted: graph,
    //     modifiedGraph: getModifiedGraph(graph.nodes, getNodeEdgeArray(graph.edges)),
    //     isLoading: false,
    // })),
    // on(graphActions.requestGraphFailure, (state, { error }) => ({
    //     ...state,
    //     error,
    //     isLoading: false,
    // })),
    // on(graphActions.dismissError, (state) => ({ ...state, error: undefined })),
);

const getNodeEdgeArray = (edges: LnGraphEdge[]): Record<PublicKey, LnGraphEdge[]> => {
    let precomputedNodeEdgeList: Record<PublicKey, LnGraphEdge[]> = {};

    edges.forEach((edge) => {
        precomputedNodeEdgeList[edge.node1_pub] = [
            ...(precomputedNodeEdgeList[edge.node1_pub] || []),
            edge,
        ];
        precomputedNodeEdgeList[edge.node2_pub] = [
            ...(precomputedNodeEdgeList[edge.node2_pub] || []),
            edge,
        ];
    });

    return precomputedNodeEdgeList;
};

const sortGraphByCentrality = (
    g: LnGraphNode[],
    precomputedNodeEdgeList: Record<PublicKey, LnGraphEdge[]>,
) => {
    return g.sort(
        (a, b) =>
            (precomputedNodeEdgeList[b.pub_key] || []).length -
            (precomputedNodeEdgeList[a.pub_key] || []).length,
    );
};

const getModifiedGraph = (
    g: LnGraphNode[],
    precomputedNodeEdgeList: Record<PublicKey, LnGraphEdge[]>,
) => {
    //const sortedNodes = sortGraphByCentrality([...g], precomputedNodeEdgeList);
    const sortedNodesWithEdges = g.reduce((acc, val, index) => {
        acc[val.pub_key] = createModifiedGraphNode(val, precomputedNodeEdgeList, index);
        return acc;
    }, {} as Record<PublicKey, LnModifiedGraphNode>);

    Object.values(sortedNodesWithEdges).forEach((node) => {
        calculateParentChildRelationship(node, sortedNodesWithEdges);
    });
    const nodesWithoutParents = Object.values(sortedNodesWithEdges).filter((node) => !node.parent);
    //console.log('nodesWithoutParents', nodesWithoutParents.length);
    Object.values(nodesWithoutParents).forEach((node) => {
        const largeClumpDistance = 1;
        node.postition = createSpherePoint(
            largeClumpDistance,
            new Vector3(0, 0, 0),
            node.pub_key.slice(0, 10),
        );
        calculatePositionFromParent(node);
    });

    return sortedNodesWithEdges;
};

const createModifiedGraphNode = (
    g: LnGraphNode,
    precomputedNodeEdgeList: Record<PublicKey, LnGraphEdge[]>,
    index: number,
): LnModifiedGraphNode => {
    return {
        pub_key: g.pub_key,
        color: g.color,
        alias: g.alias,
        connectedEdges: precomputedNodeEdgeList[g.pub_key],
        children: [] as LnModifiedGraphNode[],
    } as LnModifiedGraphNode;
};

const createSpherePoint = (r: number, position: Vector3, seed: string): THREE.Vector3 => {
    const rng = seedRandom.xor128(seed);
    const s = 2 * Math.PI * rng();
    const t = 2 * Math.PI * rng();

    const randomnessFactor = 0.2;

    const x = r * Math.cos(s) * Math.sin(t) + position.x + (rng() - 0.5) * randomnessFactor; //randomness to dissipate spheres
    const y = r * Math.sin(s) * Math.sin(t) + position.y + (rng() - 0.5) * randomnessFactor;
    const z = r * Math.cos(t) + position.z + (rng() - 0.5) * randomnessFactor;

    return new THREE.Vector3(x, y, z);
};

const calculatePositionFromParent = (n: LnModifiedGraphNode, depth = 2) => {
    n.children.forEach((child) => {
        child.postition = createSpherePoint(1 / depth, n.postition, n.pub_key.slice(0, 10));
        calculatePositionFromParent(child, depth + 1);
    });
};

export const selecteCorrectEdgePublicKey = (edge1: LnGraphEdge, compare: PublicKey): PublicKey => {
    if (edge1.node1_pub === compare) return edge1.node2_pub;
    if (edge1.node2_pub === compare) return edge1.node1_pub;
    console.log('Uh oh');
    return '' as PublicKey;
};

export const selecteOppositeCorrectEdgePublicKey = (
    edge1: LnGraphEdge,
    compare: PublicKey,
): PublicKey => {
    if (edge1.node1_pub === compare) return edge1.node1_pub;
    if (edge1.node2_pub === compare) return edge1.node2_pub;
    console.log('Uh oh');
    return '' as PublicKey;
};

const calculateParentChildRelationship = (
    n: LnModifiedGraphNode,
    nlist: Record<PublicKey, LnModifiedGraphNode>,
): void => {
    if (!n.connectedEdges) return;
    const maxConnEdge = n.connectedEdges.reduce((max, edge) =>
        nlist[selecteCorrectEdgePublicKey(max, n.pub_key)]?.connectedEdges.length >
        nlist[selecteCorrectEdgePublicKey(edge, n.pub_key)]?.connectedEdges.length
            ? max
            : edge,
    );

    //doesn't work if filtering nodes
    let maxConnNode = nlist[selecteCorrectEdgePublicKey(maxConnEdge, n.pub_key)];

    //less than or equal fixes null positions???
    if (
        !maxConnNode ||
        !maxConnEdge ||
        maxConnNode?.connectedEdges.length <= n.connectedEdges.length
    )
        return;
    if (maxConnNode?.pub_key === n.pub_key) return;

    n.parent = maxConnNode;
    n.parent.children.push(n);
};
