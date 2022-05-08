import { Injectable } from '@angular/core';
import { filter, map } from 'rxjs';
import { NodeSearchEffects } from '../../graph-renderer/effects/node-search.effects';
import { KeyValueNode } from '../components';

@Injectable({
    providedIn: 'root',
})
export class TreeDataServiceService {
    public treeData$;

    constructor(public nodeSearchEffects: NodeSearchEffects) {
        this.treeData$ = this.nodeSearchEffects.selectFinalMatcheNodesFromSearch$.pipe(
            filter((o) => o !== undefined && o !== null),
            map((object) => this.mapObject(object)),
        );
    }

    private mapObject(object: Object) {
        const o = Object.entries(object);
        return o
            .map((kv) => this.mapKeys(kv))
            .sort((a, b) => {
                if (!Number.isNaN(a) && !Number.isNaN(b)) return a - b;
                return (a.key as string)
                    .toLocaleLowerCase()
                    .localeCompare(b.key.toLocaleLowerCase());
            });
    }

    private mapKeys([key, value]) {
        if (value instanceof Object) {
            if (value instanceof Map) {
                // console.log(value);
                // const children = Array.from(value, ([name, value]) => ({ name, value }));
                // const ch = children.map((c) => this.mapObject(c));
                // console.log(ch);
                // return { key, children: ch };
                // console.log(value instanceof Map);
                const e = Array.from(value.values()) as any;
                return this.mapKeys([key, e]);
            }
            const children = this.mapObject(value);
            return { key, children: children };
        }
        return { key, value } as KeyValueNode;
    }
}
