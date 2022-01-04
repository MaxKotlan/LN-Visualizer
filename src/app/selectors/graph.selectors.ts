import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
    GraphState,
    selecteCorrectEdgePublicKey,
    selecteOppositeCorrectEdgePublicKey,
} from '../reducers/graph.reducer';
import { BufferRef } from '../types/bufferRef.interface';
import { LnGraphEdge, LnModifiedGraphNode } from '../types/graph.interface';
import { selectSearchString } from './controls.selectors';

export const graphSelector = createFeatureSelector<GraphState>('graphState');

export const selectGraphLoadingState = createSelector(graphSelector, (state) => state.isLoading);

export const selectGraphError = createSelector(graphSelector, (state) => state.error);

export const shouldShowErrorMessage = createSelector(
    graphSelector,
    (state) => !!state.error && !state.isLoading,
);

export const canDismissError = createSelector(
    graphSelector,
    (state) => !!state?.graphUnsorted?.nodes?.length && state.error,
);

export const selectModifiedGraph = createSelector(graphSelector, (state) => state.modifiedGraph);

export const selectNodeValue = createSelector(selectModifiedGraph, (graph) => Object.values(graph));

const positions = new Float32Array(18000 * 3);

export const selectVertices = createSelector(selectNodeValue, (nodeValue) => {
    // for (let i = 0; i < nodeValue.length * 3; i += 3) {
    //      [i] = nodeValue[i]?.postition.x * 100;
    //     positions[i + 1] = nodeValue[i + 1]?.postition.y * 100;
    //     positions[i + 2] = nodeValue[i + 2]?.postition.z * 100;
    // }
    // return new Float32Array(
    //     nodeValue.flatMap((n) => [n.postition.x * 100, n.postition.y * 100, n.postition.z * 100]),
    // );

    positions.set(
        nodeValue.flatMap((n) => [n.postition.x * 100, n.postition.y * 100, n.postition.z * 100]),
    );

    return { bufferRef: positions, size: nodeValue.length } as BufferRef<Float32Array>;
});

const fromHexString = (hexString: string) =>
    hexString
        .replace('#', '')
        .match(/.{1,2}/g)!
        .map((byte) => parseInt(byte, 16));

const colors = new Uint8Array(18000 * 3);

export const selectColors = createSelector(selectNodeValue, (nodeValue) => {
    colors.set(
        nodeValue
            .map((g) => g.color)
            .map(fromHexString)
            .flat(),
    );
    return colors;
});

export const getNodes = createSelector(graphSelector, (state) => state.graphUnsorted);

export const selectPossibleNodesFromSearch = createSelector(
    selectNodeValue,
    selectSearchString,
    (nodes, searchString) =>
        nodes.filter(
            (a) =>
                a.pub_key.toUpperCase().includes(searchString.toUpperCase()) ||
                a.alias.toUpperCase().includes(searchString.toUpperCase()),
        ),
);

export const selectFinalMatcheNodesFromSearch = createSelector(
    selectPossibleNodesFromSearch,
    selectSearchString,
    (nodes, searchString) => {
        if (nodes.length === 1) return nodes[0];
        const exactMatch = nodes.find(
            (node: LnModifiedGraphNode) =>
                searchString &&
                searchString !== '' &&
                searchString.length > 2 &&
                (node.alias === searchString || node.pub_key === searchString),
        );
        return exactMatch;
    },
);

export const selectSortedEdges = createSelector(
    getNodes,
    selectFinalMatcheNodesFromSearch,
    (nodeValue, searchResult) =>
        nodeValue.edges.filter((edge) =>
            searchResult === undefined ? true : edgeDirectlyRelated(searchResult, edge),
        ),
);

export const selectNodesSearchResults = createSelector(
    selectPossibleNodesFromSearch,
    (nodes) => nodes.map((a) => ({ publicKey: a.pub_key, alias: a.alias })).slice(0, 100), //hardcode max search for now
);

export const selectAliases = createSelector(selectNodeValue, (nodeValue) =>
    nodeValue.map((g) => g.alias),
);

export const selectEdgeColor = createSelector(
    selectSortedEdges,
    selectFinalMatcheNodesFromSearch,
    (sortedEdges, searchResult) => {
        //console.log(searchResult);
        if (searchResult === undefined) {
            const largestCapacity = Math.max(...sortedEdges.map((e) => parseInt(e.capacity)));
            const colTemp = sortedEdges
                .map((edge: LnGraphEdge) => [
                    (1 - parseInt(edge.capacity) / largestCapacity) * 50000 + 25,
                    (parseInt(edge.capacity) / largestCapacity) * 50000 + 25,
                    40,
                ])
                .map((a) => [...a, ...a])
                .flat();
            return new Uint8Array(colTemp);
        } else {
            const colTemp = sortedEdges
                .map((edge: LnGraphEdge) => {
                    if (edgeDirectlyRelated(searchResult, edge)) {
                        if (
                            selecteCorrectEdgePublicKey(edge, searchResult.pub_key) ===
                            edge.node1_pub
                        )
                            return [126, 125, 0, 255, 0, 0];
                        if (
                            selecteCorrectEdgePublicKey(edge, searchResult.pub_key) ===
                            edge.node2_pub
                        )
                            return [126, 125, 0, 255, 0, 0];
                        //return blue so i know this is broken
                        return [0, 0, 255, 0, 0, 255];
                    } else {
                        return [0, 0, 0, 0, 0, 0];
                    }
                })
                // .map(a => [...a,...a])
                .flat();
            return new Uint8Array(colTemp);
        }
    },
);

const edgeDirectlyRelated = (node: LnModifiedGraphNode, edge: LnGraphEdge): boolean => {
    return node.pub_key === edge.node1_pub || node.pub_key === edge.node2_pub;
};

export const selectEdgeVertices = createSelector(
    selectSortedEdges,
    selectModifiedGraph,
    selectFinalMatcheNodesFromSearch,
    (sortedEdges, modifiedGraph, searchResult) => {
        const pointData: THREE.Vector3[] = [];

        for (let i = 0; i < sortedEdges.length; i++) {
            let pubkeyTest;
            let pubkeyTestOpposite;

            if (searchResult) {
                pubkeyTest = selecteCorrectEdgePublicKey(sortedEdges[i], searchResult.pub_key);
                pubkeyTestOpposite = selecteOppositeCorrectEdgePublicKey(
                    sortedEdges[i],
                    searchResult.pub_key,
                );
            } else {
                pubkeyTest = sortedEdges[i].node1_pub;
                pubkeyTestOpposite = sortedEdges[i].node2_pub;
            }

            if (pubkeyTest && modifiedGraph[pubkeyTest]?.postition)
                pointData.push(modifiedGraph[pubkeyTest].postition);

            if (pubkeyTestOpposite && modifiedGraph[pubkeyTestOpposite]?.postition)
                pointData.push(modifiedGraph[pubkeyTestOpposite].postition);
        }

        return pointData;
    },
);

/*
Will need to optimize with the nearest neighbor. For now ugly bruteforce search.
*/
// export const selectClosestPoint = (point: THREE.Vector3) =>
//     createSelector(selectNodeValue, selectVertices, (nodes, vertices) => {
//         point.divideScalar(100);
//         const distances = vertices.map((position) => position.distanceTo(point));
//         const maximum = Math.min.apply(null, distances);
//         const index = distances.indexOf(maximum);
//         return nodes[index];
//     });
