import { createFeatureSelector, createSelector } from "@ngrx/store";
import { GraphState } from "../reducers/graph.reducer";
import { LnModifiedGraphNode } from "../types/graph.interface";

export const graphSelector = createFeatureSelector<GraphState>('graphState');

export const selectGraphLoadingState = createSelector(
    graphSelector, (state) => state.isLoading
)

export const selectModifiedGraph = createSelector(
    graphSelector, (state) => state.modifiedGraph
);

export const selectPubkeysByOptimal = createSelector(
    selectModifiedGraph, 
    (modifiedGraph) => Object.values(modifiedGraph).sort(modifiedGraphSortingAlgo).map((a) => a.pub_key));

const modifiedGraphSortingAlgo = (a: LnModifiedGraphNode, b: LnModifiedGraphNode): number => {
    return b.connectedEdges.length - a.connectedEdges.length;
}

export const selectNodeValue = createSelector(
    selectModifiedGraph,
    (graph) => Object.values(graph)
);

export const selectVertices = createSelector(
    selectNodeValue,
    (nodeValue) => nodeValue.map((g) => g.postition)
);

const fromHexString = (hexString: string) => (hexString.replace('#', '').match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));

export const selectColors = createSelector(
    selectNodeValue,
    (nodeValue) => new Uint8Array(nodeValue.map((g) => g.color)
    .map(fromHexString)
    .flat())
);

export const getNodes = createSelector(
    graphSelector,
    (state) => state.graphUnsorted
)