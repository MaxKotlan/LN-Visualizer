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
            .sort((a, b) =>
                (a.key as string).toLocaleLowerCase().localeCompare(b.key.toLocaleLowerCase()),
            );
    }

    private mapKeys([key, value]) {
        if (value instanceof Object) {
            const children = this.mapObject(value);
            if (children.length > 0) return { key, children: children };
            return undefined;
        }
        return { key, value } as KeyValueNode;
    }
}
