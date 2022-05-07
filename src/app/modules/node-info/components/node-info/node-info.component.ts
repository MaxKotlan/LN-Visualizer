import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { map, tap } from 'rxjs';
import { NodeSearchEffects } from 'src/app/modules/graph-renderer/effects/node-search.effects';

interface KeyValueNode {
    key: string;
    value?: string;
    children?: KeyValueNode[];
}

@UntilDestroy()
@Component({
    selector: 'app-node-info',
    templateUrl: './node-info.component.html',
    styleUrls: ['./node-info.component.scss'],
})
export class NodeInfoComponent {
    treeControl = new NestedTreeControl<KeyValueNode>((node) => node.children);
    dataSource = new MatTreeNestedDataSource<KeyValueNode>();
    public treeData$;

    constructor(public nodeSearchEffects: NodeSearchEffects) {
        this.treeData$ = this.nodeSearchEffects.selectFinalMatcheNodesFromSearch$.pipe(
            untilDestroyed(this),
            map((object) => this.mapObject(object)),
        );
        this.treeData$.subscribe((data) => {
            this.dataSource.data = data;
        });
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

    hasChild = (_: number, node: KeyValueNode) => !!node.children && node.children.length > 0;
}
