import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { LndChannel } from 'api/src/models';
import { lastValueFrom, take } from 'rxjs';
import {
    ChannelEvaluationFunction,
    Filter,
} from 'src/app/modules/controls-graph-filter/types/filter.interface';
import { NodeSearchEffects } from 'src/app/modules/graph-renderer/effects/node-search.effects';
import { ChannelRegistryService } from 'src/app/modules/graph-renderer/services/channel-registry/channel-registry.service';
import { NodeRegistryService } from 'src/app/modules/graph-renderer/services/node-registry/node-registry.service';
import { LndNodeWithPosition } from 'src/app/types/node-position.interface';
import * as filterActions from '../../../controls-graph-filter/actions';

function Node(data) {
    this.data = data;
    this.next = null;
}

// Queue implemented using LinkedList
function Queue() {
    this.head = null;
    this.tail = null;
    this.length = 0;
}

Queue.prototype.enqueue = function (data) {
    var newNode = new Node(data);

    if (this.head === null) {
        this.head = newNode;
        this.tail = newNode;
    } else {
        this.tail.next = newNode;
        this.tail = newNode;
    }
    this.length = this.length + 1;
};

Queue.prototype.dequeue = function () {
    var newNode;
    if (this.head !== null) {
        newNode = this.head.data;
        this.head = this.head.next;
    }
    this.length = this.length - 1;
    return newNode;
};

Queue.prototype.print = function () {
    var curr = this.head;
    while (curr) {
        console.log(curr.data);
        curr = curr.next;
    }
};

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
        this.applyDepthMaskChannel(activeNode, depth);

        this.store$.dispatch(
            filterActions.updateChannelFilterByIssueId({
                value: {
                    interpreter: 'javascript',
                    issueId: 'min-cut-range',
                    source: 'test',
                    function: (channel: LndChannel) => channel['depth'] <= depth,
                    // channel.policies.some((p) => {
                    //     const a = p['node'];
                    //     return a && ['deppth'] === 2;
                    // }),
                } as Filter<ChannelEvaluationFunction>,
            }),
        );

        // this.store$.dispatch(
        //     filterActions.updateNodeFilterByIssueId({
        //         value: {
        //             interpreter: 'javascript',
        //             issueId: 'min-cut-range-node',
        //             source: `(node: LndNodeWithPosition) => node.depth <= ${depth} //depth from ${activeNode.alias}`,
        //             function: (node: LndNodeWithPosition) => node['depth'] <= depth,
        //             // channel.policies.some((p) => {
        //             //     const a = p['node'];
        //             //     return a && ['deppth'] === 2;
        //             // }),
        //         } as Filter<NodeEvaluationFunction>,
        //     }),
        // );
    }

    resetDepthMask() {
        this.nodeRegistryService.forEach((node) => {
            node['depth'] = undefined;
            node['visited'] = undefined;
        });
        this.channelRegistryService.forEach((channel) => {
            channel['depth'] = undefined;
            channel['visited'] = undefined;
        });
    }

    applyDepthMask(root: LndNodeWithPosition) {
        root['depth'] = 0;
        const queue: LndNodeWithPosition[] = [root];
        const a = performance.now();
        let maxDepth = 0;
        while (queue.length > 0) {
            const v = queue.pop();
            v.connected_channels?.forEach((w) => {
                w.policies.forEach((p) => {
                    // const otherNodePubKey = this.selectOtherNodeInChannel(v.public_key, w);
                    const w_n: LndNodeWithPosition = this.nodeRegistryService.get(p.public_key);
                    if (w_n?.public_key && !w_n['visited']) {
                        w['depth'] = v['depth'] + 1;
                        w_n['depth'] = v['depth'] + 1;
                        if (w_n['depth'] > maxDepth) maxDepth = w_n['depth'];
                        queue.push(w_n);
                        w_n['visited'] = true;
                    }
                });
            });
            // depth += 1;
        }
        console.log(maxDepth);
        console.log('done', performance.now() - a);
    }

    applyDepthMaskChannel(root: LndNodeWithPosition, mDepth: number = Infinity) {
        let queue: LndChannel[] = [];
        const queue2 = new Queue();

        // let queue2: MaxPriorityQueue<any> = new MaxPriorityQueue<LndChannel>(

        //     {
        //         compare: (a: LndChannel, b: LndChannel): number =>
        //     }
        // );
        root.connected_channels.forEach((c) => {
            queue2.enqueue(c);
        });
        // let queue: LndChannel[] = Array.from(root.connected_channels.values());
        const a = performance.now();
        let maxDepth = 0;
        console.log(queue2);
        while (queue2.length > 0) {
            const v = queue2.dequeue();
            // if (v['depth'] === undefined) v['depth'] = 0;
            //const p = v.policies[0];
            v.policies.forEach((p) => {
                const n = this.nodeRegistryService.get(p.public_key);
                if (!!n?.connected_channels && !n['visited']) {
                    n?.connected_channels.forEach((w) => {
                        if (v.id === w.id) w['depth'] = v['depth'] || 0;
                        else w['depth'] = (v['depth'] || 0) + 1;
                        if (w['depth'] > maxDepth) maxDepth = w['depth'];
                        // console.log(maxDepth);
                        if (w['depth'] < mDepth) queue2.enqueue(w);
                    });
                    n['visited'] = true;
                }
            });
        }
        console.log(maxDepth);
        console.log('done', performance.now() - a);
    }
}
