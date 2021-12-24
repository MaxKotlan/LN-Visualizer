import { createReducer, on } from '@ngrx/store';
import { LnGraph, LnGraphEdge, LnGraphNode, LnModifiedGraphNode } from '../types/graph.interface';
import * as graphActions from '../actions/graph.actions';
import { state } from '@angular/animations';
import * as THREE from 'three';

type PublicKey = string;

export interface GraphState {
    graphUnsorted: LnGraph,
    modifiedGraph: Record<PublicKey, LnModifiedGraphNode>
    isLoading: boolean;
};

const initialState: GraphState = {
    graphUnsorted: { nodes: [], edges: [] },
    modifiedGraph: {},
    isLoading: false
};

export const reducer = createReducer(
    initialState,
    on(
        graphActions.requestGraph,
        (state) => ({...state, isLoading: true}),
    ),
    on(
        graphActions.requestGraphSuccess,
        (state, {graph}) => ({
            ...state, 
            graphUnsorted: graph,
            modifiedGraph: getModifiedGraph(graph, getNodeEdgeArray(graph.edges)),
            isLoading: false
        })
    ),
    on(
        graphActions.requestGraphFailure,
        (state) => ({...state, isLoading: false})    
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

const sortGraphByCentrality = (g: LnGraph,  precomputedNodeEdgeList : Record<PublicKey, LnGraphEdge[]>) => {
    return [...g.nodes].sort((a, b) => precomputedNodeEdgeList[b.pub_key].length - precomputedNodeEdgeList[a.pub_key].length)
}

const getModifiedGraph = (g: LnGraph, precomputedNodeEdgeList : Record<PublicKey, LnGraphEdge[]>) => {
    const sortedNodes = sortGraphByCentrality(g, precomputedNodeEdgeList);
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