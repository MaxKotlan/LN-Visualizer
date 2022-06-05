import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { LndChannel } from 'api/src/models';
import { lastValueFrom, take } from 'rxjs';
import {
    ChannelEvaluationFunction,
    Filter,
} from 'src/app/modules/controls-graph-filter/types/filter.interface';
import { NodeSearchEffects } from 'src/app/modules/graph-renderer/effects/node-search.effects';
import { FilteredChannelRegistryService } from 'src/app/modules/graph-renderer/services';
import { NodeRegistryService } from 'src/app/modules/graph-renderer/services/node-registry/node-registry.service';
import { LndNodeWithPosition } from 'src/app/types/node-position.interface';
import * as filterActions from '../../../controls-graph-filter/actions';

@Component({
    selector: 'app-node-reach',
    templateUrl: './node-reach.component.html',
    styleUrls: ['./node-reach.component.scss'],
})
export class NodeReachComponent {
    constructor(
        private store$: Store<any>,
        private filteredChannelRegistryService: FilteredChannelRegistryService,
        private nodeRegistryService: NodeRegistryService,
        private nodeSearchEffects: NodeSearchEffects,
    ) {}

    async applyNodeReach() {
        let activeNode = await lastValueFrom(
            this.nodeSearchEffects.selectFinalMatcheNodesFromSearch$.pipe(take(1)),
        );

        this.applyDepthMask(activeNode);

        this.store$.dispatch(
            filterActions.updateChannelFilterByIssueId({
                value: {
                    interpreter: 'javascript',
                    issueId: 'min-cut-range',
                    source: 'test',
                    function: (channel: LndChannel) =>
                        channel.policies.some((p) => {
                            const a = p['node'];
                            return a && p['node']['depth'];
                        }),
                } as Filter<ChannelEvaluationFunction>,
            }),
        );
    }

    applyDepthMask(root: LndNodeWithPosition) {
        const queue: LndNodeWithPosition[] = [root];
        const visited: string[] = [];
        const a = performance.now();
        let depth = 0;
        root['depth'] = 0;
        while (queue.length > 0) {
            const v = queue.pop();
            depth += 1;
            v.connected_channels?.forEach((w) => {
                const otherNodePubKey = this.selectOtherNodeInChannel(v.public_key, w);
                const w_n: LndNodeWithPosition = this.nodeRegistryService.get(otherNodePubKey);
                if (w_n?.public_key && !visited.includes(w_n.public_key) && depth < 64) {
                    w_n['depth'] = depth;
                    queue.push(w_n);
                    visited.push(w_n.public_key);
                }
            });
            depth += 1;
        }
        console.log('done', performance.now() - a);
    }

    private selectOtherNodeInChannel(selfPubkey: string, channel: LndChannel): string {
        if (channel.policies[0].public_key === selfPubkey) return channel.policies[1].public_key;
        if (channel.policies[1].public_key === selfPubkey) return channel.policies[0].public_key;
        throw new Error('Public Key is not either of the nodes in the channel');
    }
}
