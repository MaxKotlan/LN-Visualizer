import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LndNodeWithPosition } from 'api/src/models/node-position.interface';
import { GraphState, selecteCorrectEdgePublicKey } from '../reducers/graph.reducer';
import { BufferRef } from '../types/bufferRef.interface';
import { LnGraphEdge, LnModifiedGraphNode } from '../types/graph.interface';
import { selectSearchString } from './controls.selectors';

export const graphSelector = createFeatureSelector<GraphState>('graphState');

export const selectGraphLoadingState = createSelector(graphSelector, (state) => state.isLoading);

export const selectNodeChunksProcessed = createSelector(
    graphSelector,
    (state) => state.nodeChunksProcessed,
);

export const selectChannelChunksProcessed = createSelector(
    graphSelector,
    (state) => state.channelChunksProcessed,
);

export const selectChunkInfo = createSelector(graphSelector, (state) => state.chunkInfo);

export const selectChunkRemainingPercentage = createSelector(
    selectNodeChunksProcessed,
    selectChannelChunksProcessed,
    selectChunkInfo,
    (nodesProcessed, channelsProcessed, chunkInfo) =>
        !chunkInfo
            ? 0
            : ((nodesProcessed + channelsProcessed) /
                  (chunkInfo.nodeChunks + chunkInfo.edgeChunks)) *
              100,
);

export const selectLoadingText = createSelector(graphSelector, (state) => state.loadingText);

export const selectNodeVertexBuffer = createSelector(
    graphSelector,
    (state) => state.nodeVertexBuffer,
);

export const selectNodeColorBuffer = createSelector(
    graphSelector,
    (state) => state.nodeColorBuffer,
);

export const selectChannelVertexBuffer = createSelector(
    graphSelector,
    (state) => state.channelVertexBuffer,
);

export const selectChannelColorBuffer = createSelector(
    graphSelector,
    (state) => state.channelColorBuffer,
);

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

export const selectNodeSetKeyValue = createSelector(graphSelector, (state) => state.nodeSet);
export const selectNodeSetValue = createSelector(selectNodeSetKeyValue, (keyValueNodeSet) =>
    Object.values(keyValueNodeSet),
);
export const selectChannelSetKeyValue = createSelector(graphSelector, (state) => state.channelSet);
export const selectChannelSetValue = createSelector(selectChannelSetKeyValue, (keyValueNodeSet) =>
    Object.values(keyValueNodeSet),
);

export const selectFilterChannelByCapacity = createSelector(
    selectChannelSetValue,
    (keyValueNodeSet) => keyValueNodeSet.filter((c) => c.capacity > 0),
);

export const selectEdgesFromModifiedGraph = createSelector(selectNodeValue, (graph) =>
    graph.flatMap((mgn) => mgn.connectedEdges),
);

export const selectVertices = createSelector(
    selectNodeSetValue,
    selectNodeVertexBuffer,
    (nodeValue, vertexBuffer) => {
        if (!vertexBuffer || !nodeValue) return null;
        vertexBuffer.set(
            nodeValue.flatMap((n) => [n.position.x * 100, n.position.y * 100, n.position.z * 100]),
        );
        return { bufferRef: vertexBuffer, size: nodeValue.length } as BufferRef<Float32Array>;
    },
);

const fromHexString = (hexString: string) =>
    hexString
        .replace('#', '')
        .match(/.{1,2}/g)!
        .map((byte) => parseInt(byte, 16));

export const selectColors = createSelector(
    selectNodeSetValue,
    selectNodeColorBuffer,
    (nodeValue, colorBuffer) => {
        if (!colorBuffer || !nodeValue) return null;
        colorBuffer.set(
            nodeValue
                .map((g) => g.color)
                .map(fromHexString)
                .flat(),
        );
        return colorBuffer;
    },
);

export const getNodes = createSelector(graphSelector, (state) => state.graphUnsorted);

export const selectPossibleNodesFromSearch = createSelector(
    selectNodeSetValue,
    selectSearchString,
    (nodes, searchString) =>
        nodes.filter(
            (a) =>
                a.public_key.toUpperCase().includes(searchString.toUpperCase()) ||
                a.alias.toUpperCase().includes(searchString.toUpperCase()),
        ),
);

export const selectFinalMatcheNodesFromSearch = createSelector(
    selectPossibleNodesFromSearch,
    selectSearchString,
    (nodes, searchString) => {
        if (nodes.length === 1) return nodes[0];
        const exactMatch = nodes.find(
            (node: LndNodeWithPosition) =>
                searchString &&
                searchString !== '' &&
                searchString.length > 2 &&
                (node.alias === searchString || node.public_key === searchString),
        );
        return exactMatch;
    },
);

export const selectSortedEdges = createSelector(
    selectEdgesFromModifiedGraph,
    selectFinalMatcheNodesFromSearch,
    (edges, searchResult) =>
        edges.filter(
            (edge) => (searchResult === undefined ? true : true), //edgeDirectlyRelated(searchResult, edge),
        ),
);

export const selectNodesSearchResults = createSelector(
    selectPossibleNodesFromSearch,
    (nodes) => nodes.map((a) => ({ publicKey: a.public_key, alias: a.alias })).slice(0, 100), //hardcode max search for now
);

export const selectAliases = createSelector(selectNodeValue, (nodeValue) =>
    nodeValue.map((g) => g.alias),
);

// export const selectEdgeColor = createSelector(
//     selectSortedEdges,
//     selectFinalMatcheNodesFromSearch,
//     (sortedEdges, searchResult) => {
//         //console.log(searchResult);
//         if (searchResult === undefined) {
//             const largestCapacity = Math.max(...sortedEdges.map((e) => parseInt(e.capacity)));
//             const colTemp = sortedEdges
//                 .map((edge: LnGraphEdge) => [
//                     (1 - parseInt(edge.capacity) / largestCapacity) * 50000 + 25,
//                     (parseInt(edge.capacity) / largestCapacity) * 50000 + 25,
//                     40,
//                 ])
//                 .map((a) => [...a, ...a])
//                 .flat();
//             return new Uint8Array(colTemp);
//         } else {
//             const colTemp = sortedEdges
//                 .map((edge: LnGraphEdge) => {
//                     if (edgeDirectlyRelated(searchResult, edge)) {
//                         if (
//                             selecteCorrectEdgePublicKey(edge, searchResult.pub_key) ===
//                             edge.node1_pub
//                         )
//                             return [126, 125, 0, 255, 0, 0];
//                         if (
//                             selecteCorrectEdgePublicKey(edge, searchResult.pub_key) ===
//                             edge.node2_pub
//                         )
//                             return [126, 125, 0, 255, 0, 0];
//                         //return blue so i know this is broken
//                         return [0, 0, 255, 0, 0, 255];
//                     } else {
//                         return [0, 0, 0, 0, 0, 0];
//                     }
//                 })
//                 // .map(a => [...a,...a])
//                 .flat();
//             return new Uint8Array(colTemp);
//         }
//     },
// );

const edgeDirectlyRelated = (node: LnModifiedGraphNode, edge: LnGraphEdge): boolean => {
    //console.log('node1', edge);
    return node.pub_key === edge.node1_pub || node.pub_key === edge.node2_pub;
};

export const selectEdgeVertices = createSelector(
    selectChannelSetValue,
    selectChannelVertexBuffer,
    selectNodeSetKeyValue,
    (channelValue, vertexBuffer, nodeRegistry) => {
        if (!vertexBuffer || !channelValue) return null;
        vertexBuffer.set(
            channelValue.flatMap((channel) => {
                const node1 = nodeRegistry[channel.policies[0].public_key];
                const node2 = nodeRegistry[channel.policies[1].public_key];
                if (!node1 || !node2) return [];
                return [
                    nodeRegistry[channel.policies[0].public_key].position.x * 100,
                    nodeRegistry[channel.policies[0].public_key].position.y * 100,
                    nodeRegistry[channel.policies[0].public_key].position.z * 100,
                    nodeRegistry[channel.policies[1].public_key].position.x * 100,
                    nodeRegistry[channel.policies[1].public_key].position.y * 100,
                    nodeRegistry[channel.policies[1].public_key].position.z * 100,
                ];
            }),
        );
        return { bufferRef: vertexBuffer, size: channelValue.length } as BufferRef<Float32Array>;
    },
);
//(sortedEdges, modifiedGraph, searchResult) => {
// for (let i = 0; i < sortedEdges.length * 3; i += 3) {
//     let pubkeyTest;
//     let pubkeyTestOpposite;

//     // if (searchResult) {
//     //     pubkeyTest = selecteCorrectEdgePublicKey(sortedEdges[i], searchResult.pub_key);
//     //     pubkeyTestOpposite = selecteOppositeCorrectEdgePublicKey(
//     //         sortedEdges[i],
//     //         searchResult.pub_key,
//     //     );
//     // } else {
//     if (!sortedEdges[i / 3]?.node1_pub) return { bufferRef: edgeVerticies, size: 0 };
//     if (!sortedEdges[i / 3]?.node2_pub) return { bufferRef: edgeVerticies, size: 0 };

//     pubkeyTest = sortedEdges[i / 3].node1_pub;
//     pubkeyTestOpposite = sortedEdges[i].node2_pub;
//     //}

//     if (pubkeyTest && modifiedGraph[pubkeyTest]?.postition) {
//         edgeVerticies[i / 3] = modifiedGraph[pubkeyTest]?.postition.x;
//         edgeVerticies[i / 3 + 1] = modifiedGraph[pubkeyTest]?.postition.y;
//         edgeVerticies[i / 3 + 2] = modifiedGraph[pubkeyTest]?.postition.z;
//     }

//     if (pubkeyTestOpposite && modifiedGraph[pubkeyTestOpposite]?.postition) {
//         edgeVerticies[i / 3] = modifiedGraph[pubkeyTestOpposite]?.postition.x;
//         edgeVerticies[i / 3 + 1] = modifiedGraph[pubkeyTestOpposite]?.postition.y;
//         edgeVerticies[i / 3 + 2] = modifiedGraph[pubkeyTestOpposite]?.postition.z;
//     }
// }
//         return { bufferRef: edgeVerticies, size: sortedEdges.length } as BufferRef<Float32Array>;
//     },
// );

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
