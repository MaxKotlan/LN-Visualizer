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
import { ChannelRegistryService } from 'src/app/modules/graph-renderer/services/channel-registry/channel-registry.service';
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
        private channelRegistryService: ChannelRegistryService,
        private nodeRegistryService: NodeRegistryService,
        private nodeSearchEffects: NodeSearchEffects,
    ) {}

    async applyNodeReach(depth: number) {
        let activeNode = await lastValueFrom(
            this.nodeSearchEffects.selectFinalMatcheNodesFromSearch$.pipe(take(1)),
        );

        this.resetDepthMask();
        this.applyDepthMask(activeNode);

        this.store$.dispatch(
            filterActions.updateChannelFilterByIssueId({
                value: {
                    interpreter: 'javascript',
                    issueId: 'min-cut-range',
                    source: 'test',
                    function: (channel: LndChannel) => channel['depth'] === depth,
                    // channel.policies.some((p) => {
                    //     const a = p['node'];
                    //     return a && ['deppth'] === 2;
                    // }),
                } as Filter<ChannelEvaluationFunction>,
            }),
        );
    }

    resetDepthMask() {
        this.nodeRegistryService.forEach((node) => {
            node['depth'] = undefined;
            node['visited'] = undefined;
        });
    }

    applyDepthMask(root: LndNodeWithPosition) {
        const queue: LndNodeWithPosition[] = [root];
        const a = performance.now();
        root['depth'] = 0;
        let maxDepth = 0;
        while (queue.length > 0) {
            const v = queue.pop();
            v.connected_channels?.forEach((w) => {
                const otherNodePubKey = this.selectOtherNodeInChannel(v.public_key, w);
                const w_n: LndNodeWithPosition = this.nodeRegistryService.get(otherNodePubKey);
                if (w_n?.public_key && !w_n['visited']) {
                    w['depth'] = v['depth'] + 1;
                    w_n['depth'] = v['depth'] + 1;
                    if (w_n['depth'] > maxDepth) maxDepth = w_n['depth'];
                    queue.push(w_n);
                    w_n['visited'] = true;
                }
            });
            // depth += 1;
        }
        console.log(maxDepth);
        console.log('done', performance.now() - a);
    }

    private selectOtherNodeInChannel(selfPubkey: string, channel: LndChannel): string {
        if (channel.policies[0].public_key === selfPubkey) return channel.policies[1].public_key;
        if (channel.policies[1].public_key === selfPubkey) return channel.policies[0].public_key;
        throw new Error('Public Key is not either of the nodes in the channel');
    }
}
