import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { map, tap } from 'rxjs';
import { NodeSearchEffects } from 'src/app/modules/graph-renderer/effects/node-search.effects';

/**
 * Food data with nested structure.
 * Each node has a key and an optional list of children.
 */
interface KeyValueNode {
    key: string;
    value?: string;
    children?: KeyValueNode[];
}

const TREE_DATA: KeyValueNode[] = [
    {
        key: 'Fruit',
        children: [{ key: 'Apple' }, { key: 'Banana' }, { key: 'Fruit loops' }],
    },
    {
        key: 'Vegetables',
        children: [
            {
                key: 'Green',
                children: [{ key: 'Broccoli' }, { key: 'Brussels sprouts' }],
            },
            {
                key: 'Orange',
                children: [{ key: 'Pumpkins' }, { key: 'Carrots' }],
            },
        ],
    },
];

@Component({
    selector: 'app-node-info',
    templateUrl: './node-info.component.html',
    styleUrls: ['./node-info.component.scss'],
})
export class NodeInfoComponent {
    treeControl = new NestedTreeControl<KeyValueNode>((node) => node.children);
    dataSource = new MatTreeNestedDataSource<KeyValueNode>();

    constructor(public nodeSearchEffects: NodeSearchEffects) {
        this.dataSource.data = TREE_DATA;
    }

    public mapObject(object: Object) {
        const r = Object.entries(object);
        return r.map((kv) => this.mapKeys(kv));
    }

    public mapKeys([key, value]) {
        if (value instanceof Object) {
            const children = this.mapObject(value);
            return { key, children: children };
        }
        return { key, value } as KeyValueNode;
    }

    // public mapKeys(([key, value]) => {
    //   // if (value instanceof Object){
    //   // }

    // });

    public treeData$ = this.nodeSearchEffects.selectFinalMatcheNodesFromSearch$.pipe(
        map((object) => this.mapObject(object)), // {
        //     // const r = Object.entries(object);
        //     // return r.map(([key, value]) => ({ key, value }));
        // }),
        tap((c) => console.log(c)),
        map((r) => {
            const a = new MatTreeNestedDataSource<KeyValueNode>();
            a.data = r;
            return a;
        }),
    );

    hasChild = (_: number, node: KeyValueNode) => !!node.children && node.children.length > 0;
}
