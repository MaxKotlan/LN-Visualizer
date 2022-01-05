import { Injectable } from '@angular/core';
import { LnGraphEdge, LnGraphNode, LnModifiedGraphNode } from '../types/graph.interface';
import * as THREE from 'three';
import * as seedRandom from 'seedrandom';

type PublicKey = string;

@Injectable()
export class ModifiedGraphService {
    protected getNodeEdgeArray(edges: LnGraphEdge[]): Record<PublicKey, LnGraphEdge[]> {
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
    }

    protected sortGraphByCentrality(
        g: LnGraphNode[],
        precomputedNodeEdgeList: Record<PublicKey, LnGraphEdge[]>,
    ) {
        return g.sort(
            (a, b) =>
                (precomputedNodeEdgeList[b.pub_key] || []).length -
                (precomputedNodeEdgeList[a.pub_key] || []).length,
        );
    }

    protected getModifiedGraph(
        g: LnGraphNode[],
        precomputedNodeEdgeList: Record<PublicKey, LnGraphEdge[]>,
    ) {
        //const sortedNodes = sortGraphByCentrality([...g], precomputedNodeEdgeList);
        const sortedNodesWithEdges = g.reduce((acc, val, index) => {
            acc[val.pub_key] = this.createModifiedGraphNode(val, precomputedNodeEdgeList, index);
            return acc;
        }, {} as Record<PublicKey, LnModifiedGraphNode>);

        Object.values(sortedNodesWithEdges).forEach((node) => {
            this.calculateParentChildRelationship(node, sortedNodesWithEdges);
        });
        const nodesWithoutParents = Object.values(sortedNodesWithEdges).filter(
            (node) => !node.parent,
        );
        //console.log('nodesWithoutParents', nodesWithoutParents.length);
        Object.values(nodesWithoutParents).forEach((node) => {
            const largeClumpDistance = 1;
            node.postition = this.createSpherePoint(
                largeClumpDistance,
                new THREE.Vector3(0, 0, 0),
                node.pub_key.slice(0, 10),
            );
            this.calculatePositionFromParent(node);
        });

        return sortedNodesWithEdges;
    }

    protected createModifiedGraphNode(
        g: LnGraphNode,
        precomputedNodeEdgeList: Record<PublicKey, LnGraphEdge[]>,
        index: number,
    ): LnModifiedGraphNode {
        return {
            pub_key: g.pub_key,
            color: g.color,
            alias: g.alias,
            connectedEdges: precomputedNodeEdgeList[g.pub_key],
            children: [] as LnModifiedGraphNode[],
        } as LnModifiedGraphNode;
    }

    protected createSpherePoint = (
        r: number,
        position: THREE.Vector3,
        seed: string,
    ): THREE.Vector3 => {
        const rng = seedRandom.xor128(seed);
        const s = 2 * Math.PI * rng();
        const t = 2 * Math.PI * rng();

        const x = r * Math.cos(s) * Math.sin(t) + position.x + (rng() - 0.5); //randomness to dissipate spheres
        const y = r * Math.sin(s) * Math.sin(t) + position.y + (rng() - 0.5);
        const z = r * Math.cos(t) + position.z + (rng() - 0.5);

        return new THREE.Vector3(x, y, z);
    };

    protected calculatePositionFromParent(n: LnModifiedGraphNode, depth = 2) {
        n.children.forEach((child) => {
            child.postition = this.createSpherePoint(
                1 / depth,
                n.postition,
                n.pub_key.slice(0, 10),
            );
            this.calculatePositionFromParent(child, depth + 1);
        });
    }

    protected selecteCorrectEdgePublicKey(edge1: LnGraphEdge, compare: PublicKey): PublicKey {
        if (edge1.node1_pub === compare) return edge1.node2_pub;
        if (edge1.node2_pub === compare) return edge1.node1_pub;
        console.log('Uh oh');
        return '' as PublicKey;
    }

    protected selecteOppositeCorrectEdgePublicKey(
        edge1: LnGraphEdge,
        compare: PublicKey,
    ): PublicKey {
        if (edge1.node1_pub === compare) return edge1.node1_pub;
        if (edge1.node2_pub === compare) return edge1.node2_pub;
        console.log('Uh oh');
        return '' as PublicKey;
    }

    protected calculateParentChildRelationship(
        n: LnModifiedGraphNode,
        nlist: Record<PublicKey, LnModifiedGraphNode>,
    ): void {
        if (!n.connectedEdges) return;
        const maxConnEdge = n.connectedEdges.reduce((max, edge) =>
            nlist[this.selecteCorrectEdgePublicKey(max, n.pub_key)]?.connectedEdges.length >
            nlist[this.selecteCorrectEdgePublicKey(edge, n.pub_key)]?.connectedEdges.length
                ? max
                : edge,
        );

        //doesn't work if filtering nodes
        let maxConnNode = nlist[this.selecteCorrectEdgePublicKey(maxConnEdge, n.pub_key)];

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
    }
}
