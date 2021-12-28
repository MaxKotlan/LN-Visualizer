import { createFeatureSelector, createSelector } from "@ngrx/store";
import { GraphState } from "../reducers/graph.reducer";
import { LnGraphEdge, LnModifiedGraphNode } from "../types/graph.interface";

export const graphSelector = createFeatureSelector<GraphState>('graphState');

export const selectGraphLoadingState = createSelector(
    graphSelector, (state) => state.isLoading
)

export const selectModifiedGraph = createSelector(
    graphSelector, (state) => state.modifiedGraph
);

// export const selectPubkeysByOptimal = createSelector(
//     selectModifiedGraph, 
//     (modifiedGraph) => Object.values(modifiedGraph).sort(modifiedGraphSortingAlgo).map((a) => a.pub_key));

// const modifiedGraphSortingAlgo = (a: LnModifiedGraphNode, b: LnModifiedGraphNode): number => {
//     return b.connectedEdges.length - a.connectedEdges.length;
// }

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



export const selectSearchString = createSelector(
    graphSelector,
    (state) => state.searchText
)

export const selectPossibleNodesFromSearch = createSelector(
    selectNodeValue,
    selectSearchString,
    (nodes, searchString) => nodes.filter((a) => 
        a.pub_key.toUpperCase().includes(searchString.toUpperCase()) ||
        a.alias.toUpperCase().includes(searchString.toUpperCase()))
);


export const selectFinalMatcheNodesFromSearch = createSelector(
    selectPossibleNodesFromSearch,
    selectSearchString,
    (nodes, searchString) => {
        if (nodes.length === 1) return nodes[0];
        const exactMatch = nodes.find((node: LnModifiedGraphNode) => searchString !== '' && (node.alias === searchString || node.pub_key === searchString));
        return exactMatch;
    }
);

export const selectSortedEdges = createSelector(
    getNodes,
    selectFinalMatcheNodesFromSearch,
    (nodeValue, searchResult) => nodeValue.edges.filter((edge) => searchResult === undefined ? true :
        searchResult.pub_key === edge.node1_pub ||
        searchResult.pub_key === edge.node2_pub
    )
)

export const selectNodesSearchResults = createSelector(
    selectPossibleNodesFromSearch,
    (nodes) => nodes.map((a) => 
        ({publicKey: a.pub_key, alias: a.alias}))
        .slice(0,10)
);

export const shouldRenderEdges = createSelector(
    graphSelector,
    (state) => state.renderEdges
)

export const selectAliases = createSelector(
    selectNodeValue,
    (nodeValue) => nodeValue.map((g) => g.alias)
)


export const selectEdgeColor = createSelector(
    selectSortedEdges,
    selectFinalMatcheNodesFromSearch,
    (sortedEdges, searchResult) => {
        console.log(searchResult);
        if (searchResult === undefined){

        const largestCapacity = Math.max(...sortedEdges.map((e) => parseInt(e.capacity)));
        const colTemp = sortedEdges
        .map((edge: LnGraphEdge) => [
          (1-(parseInt(edge.capacity) / largestCapacity)) * 50000+25,  
          (parseInt(edge.capacity) / largestCapacity) * 50000+25, 
          40])
        .map(a => [...a,...a])
        .flat();
        return new Uint8Array(colTemp);

        } else {
            const colTemp = sortedEdges.map((edge: LnGraphEdge) => {
                if (
                searchResult.pub_key === edge.node1_pub ||
                searchResult.pub_key === edge.node2_pub){
                    return [126,125,0];
                } else {
                    return [0,0,0];
                }
            })
            .map(a => [...a,...a])
            .flat();
            return new Uint8Array(colTemp);
        }
    }
)