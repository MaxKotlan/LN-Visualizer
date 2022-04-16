import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatest, sampleTime, map } from 'rxjs';
import { meshScale } from 'src/app/constants/mesh-scale.constant';
import {
    channelColor,
    channelColorMap,
    selectUseLogColorScale,
} from '../../controls-channel/selectors';
import { FilterEvaluatorService } from '../../controls-graph-filter/services/filter-evaluator.service';
import { setFilteredNodeChannels, setFilteredNodes } from '../actions';
import { GraphState } from '../reducer';
import { ChannelColorService, FilteredChannelRegistryService } from '../services';
import { ChannelBuffersService } from '../services/channel-buffers/channel-buffers.service';
import * as filterSelectors from '../../controls-graph-filter/selectors/filter.selectors';

@Injectable()
export class ChannelMeshEffects {
    constructor(
        private store$: Store<GraphState>,
        private actions$: Actions,
        private channelColorService: ChannelColorService,
        private filterEvaluationService: FilterEvaluatorService,
        private channelBufferService: ChannelBuffersService,
        private filteredChannelRegistryService: FilteredChannelRegistryService,
    ) {}

    readonly throttleTimeMs: number = 500;

    channelVertices$ = createEffect(
        () =>
            combineLatest([
                this.store$.select(filterSelectors.activeChannelFilters),
                this.actions$.pipe(ofType(setFilteredNodeChannels)),
                this.actions$.pipe(ofType(setFilteredNodes)),
            ]).pipe(
                sampleTime(this.throttleTimeMs),
                map(([filters, , nodeRegistry]) => {
                    if (!this.channelBufferService.vertex || !this.filteredChannelRegistryService)
                        return null;
                    let i = 0;
                    this.filteredChannelRegistryService.forEach((channel) => {
                        if (this.filterEvaluationService.evaluateFilters(channel, filters)) {
                            const node1 = nodeRegistry.nodeSet.get(channel.policies[0].public_key);
                            const node2 = nodeRegistry.nodeSet.get(channel.policies[1].public_key);
                            if (node1 && node2) {
                                this.channelBufferService.vertex.data[i * 6] =
                                    node1.position.x * meshScale;
                                this.channelBufferService.vertex.data[i * 6 + 1] =
                                    node1.position.y * meshScale;
                                this.channelBufferService.vertex.data[i * 6 + 2] =
                                    node1.position.z * meshScale;
                                this.channelBufferService.vertex.data[i * 6 + 3] =
                                    node2.position.x * meshScale;
                                this.channelBufferService.vertex.data[i * 6 + 4] =
                                    node2.position.y * meshScale;
                                this.channelBufferService.vertex.data[i * 6 + 5] =
                                    node2.position.z * meshScale;
                                i++;
                            }
                        }
                    });
                    this.channelBufferService.vertex.onUpdate.next(i * 2);
                }),
            ),
        { dispatch: false },
    );

    channelColors$ = createEffect(
        () =>
            combineLatest([
                this.store$.select(filterSelectors.activeChannelFilters),
                this.actions$.pipe(ofType(setFilteredNodeChannels)),
                this.actions$.pipe(ofType(setFilteredNodes)),
                this.store$.select(channelColor),
                this.store$.select(channelColorMap),
                this.store$.select(selectUseLogColorScale),
            ]).pipe(
                sampleTime(this.throttleTimeMs),
                map(([filters, , nodeRegistry]) => {
                    if (!this.channelBufferService.color || !this.filteredChannelRegistryService)
                        return null;
                    let i = 0;
                    this.filteredChannelRegistryService.forEach((channel) => {
                        if (this.filterEvaluationService.evaluateFilters(channel, filters)) {
                            const node1 = nodeRegistry.nodeSet.get(channel.policies[0].public_key);
                            const node2 = nodeRegistry.nodeSet.get(channel.policies[1].public_key);
                            if (node1 && node2) {
                                const color = this.channelColorService.map(node1, node2, channel);

                                this.channelBufferService.color.data[i * 6] = color[0];
                                this.channelBufferService.color.data[i * 6 + 1] = color[1];
                                this.channelBufferService.color.data[i * 6 + 2] = color[2];
                                this.channelBufferService.color.data[i * 6 + 3] = color[3];
                                this.channelBufferService.color.data[i * 6 + 4] = color[4];
                                this.channelBufferService.color.data[i * 6 + 5] = color[5];
                                i++;
                            }
                        }
                    });
                    this.channelBufferService.color.onUpdate.next(i * 2);
                }),
            ),
        { dispatch: false },
    );
}
