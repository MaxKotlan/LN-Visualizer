import { createReducer, on } from '@ngrx/store';
import { LnGraph, LnGraphEdge, LnGraphNode, LnModifiedGraphNode } from '../types/graph.interface';
import * as graphActions from '../actions/graph.actions';
import * as THREE from 'three';
import { Vector3 } from 'three';
import { HttpErrorResponse } from '@angular/common/http';

type PublicKey = string;

export interface GraphState {
    graphUnsorted: LnGraph,
    modifiedGraph: Record<PublicKey, LnModifiedGraphNode>
    isLoading: boolean;
    error: HttpErrorResponse | undefined;
};

const initialState: GraphState = {
    graphUnsorted: { nodes: [], edges: [] },
    modifiedGraph: {},
    isLoading: false,
    error: undefined
};

export const reducer = createReducer(
    initialState,
    on(
        graphActions.requestGraph,
        (state) => ({...state, error: undefined, isLoading: true}),
    ),
    on(
        graphActions.requestGraphSuccess,
        (state, {graph}) => ({
            ...state, 
            graphUnsorted: graph,
            modifiedGraph: getModifiedGraph(graph.nodes, getNodeEdgeArray(graph.edges)),
            isLoading: false
        })
    ),
    on(
        graphActions.requestGraphFailure,
        (state, {error}) => ({...state, error, isLoading: false})
    ),
    on(
        graphActions.dismissError,
        (state) => ({...state, error: undefined})
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
    return g.sort((a, b) => (precomputedNodeEdgeList[b.pub_key].length - precomputedNodeEdgeList[a.pub_key].length));
}

const getModifiedGraph = (g: LnGraphNode[], precomputedNodeEdgeList : Record<PublicKey, LnGraphEdge[]>) => {
    const sortedNodes = sortGraphByCentrality([...g], precomputedNodeEdgeList);
    const sortedNodesWithEdges = sortedNodes.reduce((acc, val, index) => {
        acc[val.pub_key] = createModifiedGraphNode(val, precomputedNodeEdgeList, index);
        return acc;
    }, {} as Record<PublicKey, LnModifiedGraphNode>)

    Object.values(sortedNodesWithEdges).forEach(node => {
        calculateParentChildRelationship(node, sortedNodesWithEdges)
    });
    const nodesWithoutParents = Object.values(sortedNodesWithEdges).filter((node) => !node.parent);
    console.log('nodesWithoutParents', nodesWithoutParents)
    Object.values(nodesWithoutParents).forEach(node => {
        node.postition = createSpherePoint(1, new Vector3(0,0,0));
        calculatePositionFromParent(node)
    });

    return sortedNodesWithEdges;
}

const createModifiedGraphNode = (g: LnGraphNode, precomputedNodeEdgeList : Record<PublicKey, LnGraphEdge[]>, index: number): LnModifiedGraphNode =>{
    return {
        pub_key: g.pub_key,
        color: g.color,
        alias: g.alias,
        connectedEdges: precomputedNodeEdgeList[g.pub_key],
        children: [] as LnModifiedGraphNode[],
    } as LnModifiedGraphNode;
}

const createSpherePoint = (r: number, position: Vector3): THREE.Vector3 => {
    const s = 2*Math.PI*(Math.random())
    const t = 2*Math.PI*(Math.random())

    const x = r * Math.cos(s) * Math.sin(t) + position.x + (Math.random()-.5); //randomness to dissipate spheres
    const y = r * Math.sin(s) * Math.sin(t) + position.y + (Math.random()-.5);
    const z = r * Math.cos(t) + position.z + (Math.random()-.5);

    return new THREE.Vector3(x, y, z);
}

const calculatePositionFromParent = (n: LnModifiedGraphNode, depth=2) => {
    //createSpherePoint();
    n.children.forEach((child) => {
        child.postition = createSpherePoint(depth, n.postition);
        calculatePositionFromParent(child, depth+1);
    })
}

export const selecteCorrectEdgePublicKey = (edge1: LnGraphEdge, compare: PublicKey): PublicKey => {
    if (edge1.node1_pub === compare) return edge1.node2_pub;
    if (edge1.node2_pub === compare) return edge1.node1_pub;
    console.log('Uh oh')
    return '' as PublicKey;
}

export const selecteOppositeCorrectEdgePublicKey = (edge1: LnGraphEdge, compare: PublicKey): PublicKey => {
    if (edge1.node1_pub === compare) return edge1.node1_pub;
    if (edge1.node2_pub === compare) return edge1.node2_pub;
    console.log('Uh oh')
    return '' as PublicKey;
}

const calculateParentChildRelationship = (n: LnModifiedGraphNode, nlist: Record<PublicKey, LnModifiedGraphNode>): void => {

    const maxConnEdge = n.connectedEdges.reduce((max, edge) => 
        nlist[selecteCorrectEdgePublicKey(max, n.pub_key)]?.connectedEdges.length > 
        nlist[selecteCorrectEdgePublicKey(edge, n.pub_key)]?.connectedEdges.length ? 
            max : 
            edge
        );

    //doesn't work if filtering nodes
    let maxConnNode = nlist[selecteCorrectEdgePublicKey(maxConnEdge, n.pub_key)];

    //less than or equal fixes null positions???
    if (!maxConnNode || !maxConnEdge || maxConnNode?.connectedEdges.length <= n.connectedEdges.length) return;
    if (maxConnNode?.pub_key === n.pub_key) return;

    n.parent = maxConnNode;
    n.parent.children.push(n);
}