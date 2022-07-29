import { Injectable } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import moment from 'moment';
import { combineLatest, filter, map } from 'rxjs';
import { graphNodePositionRecalculate } from 'src/app/graph-data/graph-process-data/actions';
import { NodeSearchEffects } from 'src/app/renderer/graph-renderer/effects/node-search.effects';
import { KeyValueNode } from '../components';

@Injectable({
    providedIn: 'root',
})
export class TreeDataServiceService {
    public treeData$;

    constructor(public nodeSearchEffects: NodeSearchEffects, public actions: Actions) {
        const s = this.nodeSearchEffects.selectFinalMatcheNodesFromSearch$;
        const t = this.actions.pipe(ofType(graphNodePositionRecalculate));

        this.treeData$ = combineLatest([s, t]).pipe(
            map(([s]) => s),
            filter((o) => o !== undefined && o !== null),
            map((object) => this.mapObject(object)),
        );
    }

    private mapObject(object: Object) {
        const o = Object.entries(object);
        return o
            .filter(([, v]) => v !== null && v !== undefined && v.length !== 0 && v.size !== 0)
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
                const r = this.mapObject(Object.fromEntries(value.entries()));
                return { key, children: r };
            }
            const children = this.mapObject(value);
            return { key, children: children };
        }
        if (key === 'updated_at') {
            const a = moment(value);
            return { key, value: a.toLocaleString() } as KeyValueNode;
        }
        return { key, value } as KeyValueNode;
    }
}
