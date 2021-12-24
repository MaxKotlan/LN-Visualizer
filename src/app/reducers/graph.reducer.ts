import { createReducer, on } from '@ngrx/store';
import { LnGraph, LnGraphEdge, LnGraphNode, LnModifiedGraphNode } from '../types/graph.interface';
import * as graphActions from '../actions/graph.actions';
import { state } from '@angular/animations';
import * as THREE from 'three';

type PublicKey = string;

export interface GraphState {
    graphUnsorted: LnGraph,
    modifiedGraph: Record<PublicKey, LnModifiedGraphNode>
    searchText: string,
    renderEdges: boolean,
    minimumEdges: number;
    isLoading: boolean;
};

const initialState: GraphState = {
    graphUnsorted: { nodes: [], edges: [] },
    modifiedGraph: {},
    searchText: '',
    renderEdges: false,
    minimumEdges: 0,
    isLoading: false
};

export const reducer = createReducer(
    initialState,
    on(
        graphActions.requestGraph,
        (state) => ({...state, isLoading: true}),
    ),
    on(
        graphActions.renderEdges,
        (state, {value}) => ({...state, renderEdges: value})
    ),
    on(
        graphActions.minEdgesRecompute,
        (state, {minEdges}) => ({
            ...state, 
            minimumEdges: minEdges,
            modifiedGraph: getModifiedGraph(state.graphUnsorted.nodes, getNodeEdgeArray(state.graphUnsorted.edges), minEdges),
        })
    ),
    on(
        graphActions.requestGraphSuccess,
        (state, {graph}) => ({
            ...state, 
            graphUnsorted: graph,
            modifiedGraph: getModifiedGraph(graph.nodes, getNodeEdgeArray(graph.edges), state.minimumEdges),
            isLoading: false
        })
    ),
    on(
        graphActions.requestGraphFailure,
        (state) => ({...state, isLoading: false})
    ),
    on(
        graphActions.searchGraph,
        (state, {searchText}) => ({...state, searchText })
    )
);

const getNodeEdgeArray = (edges: LnGraphEdge[]): Record<PublicKey, LnGraphEdge[]> => {
    
    let precomputedNodeEdgeList: Record<PublicKey, LnGraphEdge[]> = {};

    edges.forEach(edge => {
        precomputedNodeEdgeList[edge.node1_pub] = [...precomputedNodeEdgeList[edge.node1_pub] || [], edge]
        precomputedNodeEdgeList[edge.node2_pub] = [...precomputedNodeEdgeList[edge.node2_pub] || [], edge]
    })

    return precomputedNodeEdgeList;
}

const sortGraphByCentrality = (g: LnGraphNode[],  precomputedNodeEdgeList : Record<PublicKey, LnGraphEdge[]>) => {
    return g.sort((a, b) => precomputedNodeEdgeList[a.pub_key].length - precomputedNodeEdgeList[b.pub_key].length)
}

const getModifiedGraph = (g: LnGraphNode[], precomputedNodeEdgeList : Record<PublicKey, LnGraphEdge[]>, minEdges: number) => {
    const filteredNodes: LnGraphNode[] = g.filter((a) => precomputedNodeEdgeList[a.pub_key].length > minEdges);
    const sortedNodes = sortGraphByCentrality(filteredNodes, precomputedNodeEdgeList);
    return sortedNodes.reduce((acc, val, index) => {
        acc[val.pub_key] = createModifiedGraphNode(val, precomputedNodeEdgeList, index);
        return acc;
    }, {} as Record<PublicKey, LnModifiedGraphNode>)
}

const createModifiedGraphNode = (g: LnGraphNode, precomputedNodeEdgeList : Record<PublicKey, LnGraphEdge[]>, index: number): LnModifiedGraphNode =>{
    return {
        pub_key: g.pub_key,
        color: g.color,
        postition: createSpherePoint(index),
        alias: g.alias,
        connectedEdges: precomputedNodeEdgeList[g.pub_key]
    } as LnModifiedGraphNode;
}

const createSpherePoint = (i: number): THREE.Vector3 => {
    let x = Math.random()-.5;
    let y = (Math.random()-.5)/1;
    let z = Math.random()-.5;
    const mag = (1/Math.sqrt(i))*Math.sqrt(x*x + y*y + z*z);
    x /= mag; y /= mag; z /= mag;
    return new THREE.Vector3(x, y, z);
}