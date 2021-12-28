import { createReducer, on } from '@ngrx/store';
import { LnGraph, LnGraphEdge, LnGraphNode, LnModifiedGraphNode } from '../types/graph.interface';
import * as graphActions from '../actions/graph.actions';
import { state } from '@angular/animations';
import * as THREE from 'three';
import { Vector3 } from 'three';

type PublicKey = string;

export interface GraphState {
    graphUnsorted: LnGraph,
    modifiedGraph: Record<PublicKey, LnModifiedGraphNode>
    searchText: string,
    renderEdges: boolean,
    minimumEdges: number;
    sortAscending: boolean;
    isLoading: boolean;
};

const initialState: GraphState = {
    graphUnsorted: { nodes: [], edges: [] },
    modifiedGraph: {},
    searchText: '',
    renderEdges: false,
    minimumEdges: 0,
    sortAscending: false,
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
        graphActions.sortOrderChange,
        (state, {ascending}) => ({
            ...state,
            sortAscending: ascending,
            modifiedGraph: getModifiedGraph(state.graphUnsorted.nodes, getNodeEdgeArray(state.graphUnsorted.edges), state.minimumEdges, ascending),
        })
    ),
    on(
        graphActions.minEdgesRecompute,
        (state, {minEdges}) => ({
            ...state, 
            minimumEdges: minEdges,
            modifiedGraph: getModifiedGraph(state.graphUnsorted.nodes, getNodeEdgeArray(state.graphUnsorted.edges), minEdges, state.sortAscending),
        })
    ),
    on(
        graphActions.requestGraphSuccess,
        (state, {graph}) => ({
            ...state, 
            graphUnsorted: graph,
            modifiedGraph: getModifiedGraph(graph.nodes, getNodeEdgeArray(graph.edges), state.minimumEdges, state.sortAscending),
            isLoading: false
        })
    ),
    on(
        graphActions.requestGraphFailure,
        (state) => ({...state, isLoading: false})
    ),
);

const getNodeEdgeArray = (edges: LnGraphEdge[]): Record<PublicKey, LnGraphEdge[]> => {
    
    let precomputedNodeEdgeList: Record<PublicKey, LnGraphEdge[]> = {};

    edges.forEach(edge => {
        precomputedNodeEdgeList[edge.node1_pub] = [...precomputedNodeEdgeList[edge.node1_pub] || [], edge]
        precomputedNodeEdgeList[edge.node2_pub] = [...precomputedNodeEdgeList[edge.node2_pub] || [], edge]
    })

    return precomputedNodeEdgeList;
}

const sortGraphByCentrality = (g: LnGraphNode[],  precomputedNodeEdgeList : Record<PublicKey, LnGraphEdge[]>, sortAscending: boolean) => {
    return g.sort((a, b) => (
        sortAscending? 
            precomputedNodeEdgeList[a.pub_key].length - precomputedNodeEdgeList[b.pub_key].length :
            precomputedNodeEdgeList[b.pub_key].length - precomputedNodeEdgeList[a.pub_key].length
    ));
}

const getModifiedGraph = (g: LnGraphNode[], precomputedNodeEdgeList : Record<PublicKey, LnGraphEdge[]>, minEdges: number, sortAscending: boolean) => {
    const filteredNodes: LnGraphNode[] = g.filter((a) => precomputedNodeEdgeList[a.pub_key].length > minEdges);
    const sortedNodes = sortGraphByCentrality(filteredNodes, precomputedNodeEdgeList, sortAscending);
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
    // if (!maxConnNode){
    //     return new Vector3(0,0,0);
    // }

    // if (maxConnNode !== undefined && maxConnNode.visited === false){
    //     maxConnNode.postition = createSpherePoint(1, new Vector3(0,0,0));// new Vector3(0,0,0)
    //     updatePositionTransform(maxConnNode);
    //     maxConnNode.visited = true;
    // }
    n.parent = maxConnNode;
    n.parent.children.push(n);    // maxConnNode.children.push(n);
        // n.children.forEach((q) => q.postition.add(maxConnNode.postition))
        // n.postition = createSpherePoint(1, maxConnNode.postition)
        //n.postition = new Vector3(0,0,0)
    //} else {
        //n.children.forEach((q) => q.postition.add(maxConnNode?.postition || new Vector3(0,0,0)))

    //if (!n) return;
   // n.postition = createSpherePoint(1, n?.parent?.postition)
   // updatePositionTransform(n);

    //}


    //return n.postition;//.distanceTo(new Vector3(0,0,0)) > 100 ? createSpherePoint(100, new Vector3(0,0,0)) : n.postition;
}

// const updatePositionTransform = (node: LnModifiedGraphNode, depth=0) => {
//     //if (node.children.length === 0) return;
//     //node.postition = createSpherePoint(1, node?.parent?.postition || new Vector3(0,0,0))
    
//     //let remainingChildUpdates = node.children;

//     //while(remainingChildUpdates.length !== 0){
//     //    remainingChildUpdates.forEach((q) => {
//             //updatePositionTransform(q);
//     //        q.postition.add(q.parent.postition || new Vector3(0,0,0));
            
//     //    })
//     //}
//     //if (true) return;
//     if (depth > 100) return;

//     node.children.forEach((child) => {
//         child.postition.add(child.parent.postition);
//         depth += 1;
//         updatePositionTransform(child, depth);
//     })
// }