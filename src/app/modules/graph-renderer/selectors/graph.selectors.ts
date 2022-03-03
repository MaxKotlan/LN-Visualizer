import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LndNodeWithPosition } from 'src/app/types/node-position.interface';
import { meshScale } from '../../../constants/mesh-scale.constant';
import { GraphState } from '../reducer/graph.reducer';
import { selectSearchString } from '../../controls/selectors/controls.selectors';

export const graphSelector = createFeatureSelector<GraphState>('graphState');

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
    (nodesProcessed, channelsProcessed, chunkInfo) => {
        if (!chunkInfo) return 0;
        const processed = 1 / nodesProcessed + channelsProcessed;
        const total = /*5.6 * chunkInfo.nodeChunks +*/ chunkInfo.edgeChunks;
        return (processed / total) * 100;
    },
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

export const selectNodeCapacityBuffer = createSelector(
    graphSelector,
    (state) => state.nodeCapacityBuffer,
);

export const selectChannelVertexBuffer = createSelector(
    graphSelector,
    (state) => state.channelVertexBuffer,
);

export const selectChannelColorBuffer = createSelector(
    graphSelector,
    (state) => state.channelColorBuffer,
);

export const selectNodeSetKeyValue = createSelector(graphSelector, (state) => state.nodeSet);
// export const selectNodeSetValue = createSelector(selectNodeSetKeyValue, (keyValueNodeSet) => {
//     console.log(keyValueNodeSet);
//     return Object.values(keyValueNodeSet);
// });
export const selectChannelSetKeyValue = createSelector(graphSelector, (state) => state.channelSet);
// export const selectChannelSetValue = createSelector(selectChannelSetKeyValue, (keyValueNodeSet) =>
//     Object.values(keyValueNodeSet),
// );

// export const selectFilterChannelByCapacity = createSelector(
//     selectChannelSetValue,
//     (keyValueNodeSet) => keyValueNodeSet.filter((c) => c.capacity > 0),
// );

export const selectPossibleNodesFromSearch = createSelector(
    selectNodeSetKeyValue,
    selectSearchString,
    (nodes, searchString) => {
        let possibleResults: LndNodeWithPosition[] = [];
        nodes.forEach((a) => {
            if (
                a.public_key.toUpperCase().includes(searchString.toUpperCase()) ||
                a.alias.toUpperCase().includes(searchString.toUpperCase())
            ) {
                possibleResults.push(a);
            }
        });
        //possibleResults.sort((a, b) => b.children.size - a.children.size);
        return possibleResults;
    },
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

export const selectFinalMatchAliasFromSearch = createSelector(
    selectFinalMatcheNodesFromSearch,
    (nodeMatch) => nodeMatch?.alias || '',
);

// /*Can be optimized by using registry instead*/
// export const selectFilterBySearchedNode = createSelector(
//     selectChannelSetKeyValue,
//     selectFinalMatcheNodesFromSearch,
//     (channelValues, searchedNode) =>
//         !!searchedNode
//             ? channelValues.filter(
//                   (n) =>
//                       n.policies[0].public_key === searchedNode?.public_key ||
//                       n.policies[1].public_key === searchedNode?.public_key,
//               )
//             : channelValues,
// );

export const selectNodesSearchResults = createSelector(
    selectPossibleNodesFromSearch,
    (nodes) => nodes.map((a) => ({ publicKey: a.public_key, alias: a.alias })).slice(0, 100), //hardcode max search for now
);

// export const selectAliases = createSelector(selectNodeSetValue, (nodeValue) =>
//     nodeValue.map((g) => g.alias),
// );

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

export const selectNodeCount = createSelector(graphSelector, (state) => state.nodeCount);
export const selectChannelCount = createSelector(graphSelector, (state) => state.channelCount);

export const selectClosestPoint = (point: THREE.Vector3) =>
    createSelector(selectNodeSetKeyValue, (nodeSetValue) => {
        if (!nodeSetValue) return;
        point.divideScalar(meshScale);
        let minDistance: null | number = null;
        let minDistanceIndex: null | string = null;
        nodeSetValue.forEach((node: LndNodeWithPosition, pubkey) => {
            const pointDisance = node.position.distanceTo(point);
            if (minDistance === null || pointDisance < minDistance) {
                minDistance = pointDisance;
                minDistanceIndex = pubkey;
            }
        });
        if (minDistanceIndex === null) return;
        return nodeSetValue.get(minDistanceIndex);
    });

export const selectTotalChannelCapacity = createSelector(
    graphSelector,
    (state) => state.totalChannelCapacity,
);

export const selectMaximumChannelCapacity = createSelector(
    graphSelector,
    (state) => state.maximumChannelCapacity,
);

export const selectMinimumChannelCapacity = createSelector(
    graphSelector,
    (state) => state.minimumChannelCapacity,
);

export const selectAverageCapacity = createSelector(
    selectTotalChannelCapacity,
    selectChannelCount,
    (totalCapacity, channelCount) => Math.floor(totalCapacity / channelCount) || 0,
);
