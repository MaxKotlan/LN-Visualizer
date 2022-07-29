import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatest, map, debounceTime } from 'rxjs';
import { meshScale } from 'src/app/constants/mesh-scale.constant';
import {
    channelColor,
    channelColorMap,
    selectUseLogColorScale,
    selectColorRangeMinMax,
} from 'src/app/ui/settings/controls-channel/selectors';
import { selectMinMax } from 'src/app/graph-data/graph-statistics/selectors';
import { setFilteredNodeChannels } from '../../../graph-data/graph-process-data/actions';
import { GraphState } from '../reducer';
import { ChannelColorService, FilteredChannelRegistryService } from '../services';
import { ChannelBuffersService } from '../services/channel-buffers/channel-buffers.service';
import { FilteredNodeRegistryService } from '../services/filtered-node-registry/filtered-node-registry.service';
import * as graphActions from 'src/app/graph-data/graph-process-data/actions';

@Injectable()
export class ChannelMeshEffects {
    constructor(
        private store$: Store<GraphState>,
        private actions$: Actions,
        private channelColorService: ChannelColorService,
        private channelBufferService: ChannelBuffersService,
        private filteredChannelRegistryService: FilteredChannelRegistryService,
        private filteredNodeRegistry: FilteredNodeRegistryService,
    ) {}

    readonly throttleTimeMs: number = 250;

    channelVertices$ = createEffect(
        () =>
            //combineLatest([
            // this.store$.select(filterSelectors.activeChannelFilters),
            this.actions$.pipe(
                ofType(setFilteredNodeChannels),
                // this.actions$.pipe(ofType(setFilteredNodes)),
                //])
                //.pipe(
                debounceTime(this.throttleTimeMs),
                map(() => {
                    if (!this.channelBufferService.vertex || !this.filteredChannelRegistryService)
                        return null;
                    let i = 0;
                    // this.filteredStatisticsCaluclator.resetFilterStatistics();
                    this.filteredChannelRegistryService.forEach((channel) => {
                        //if (this.filterEvaluationService.evaluateFilters(channel, filters)) {
                        const node1 = this.filteredNodeRegistry.get(channel.policies[0].public_key);
                        const node2 = this.filteredNodeRegistry.get(channel.policies[1].public_key);
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

                            // this.filteredStatisticsCaluclator.checkChannel(channel);
                        }
                        // }
                    });
                    // this.filteredStatisticsCaluclator.updateStore();
                    this.channelBufferService.vertex.onUpdate.next(i * 2);
                }),
            ),
        { dispatch: false },
    );

    channelColors$ = createEffect(
        () =>
            combineLatest([
                // this.store$.select(filterSelectors.activeChannelFilters),
                this.actions$.pipe(ofType(setFilteredNodeChannels)),
                // this.actions$.pipe(ofType(setFilteredNodes)),
                this.store$.select(selectColorRangeMinMax),
                this.store$.select(channelColor),
                this.store$.select(channelColorMap),
                this.store$.select(selectUseLogColorScale),
            ]).pipe(
                debounceTime(this.throttleTimeMs),
                map(([,]) => {
                    if (!this.channelBufferService.color || !this.filteredChannelRegistryService)
                        return null;
                    let i = 0;
                    this.filteredChannelRegistryService.forEach((channel) => {
                        //if (this.filterEvaluationService.evaluateFilters(channel, filters)) {
                        const node1 = this.filteredNodeRegistry.get(channel.policies[0].public_key);
                        const node2 = this.filteredNodeRegistry.get(channel.policies[1].public_key);
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
                        //}
                    });
                    this.channelBufferService.color.onUpdate.next(i * 2);
                }),
            ),
        { dispatch: false },
    );

    channelThickness$ = createEffect(
        () =>
            combineLatest([
                // this.store$.select(filterSelectors.activeChannelFilters),
                this.actions$.pipe(ofType(setFilteredNodeChannels)),
                this.actions$.pipe(ofType(graphActions.channelStatisticsDoneComputing)),
                // this.actions$.pipe(ofType(setFilteredNodes)),
                this.store$.select(selectMinMax('capacity')),
            ]).pipe(
                debounceTime(this.throttleTimeMs),
                map(([, , channelMinMax]) => {
                    if (!this.channelBufferService.color || !this.filteredChannelRegistryService)
                        return null;
                    let i = 0;
                    this.filteredChannelRegistryService.forEach((channel) => {
                        //if (this.filterEvaluationService.evaluateFilters(channel, filters)) {
                        const node1 = this.filteredNodeRegistry.get(channel.policies[0].public_key);
                        const node2 = this.filteredNodeRegistry.get(channel.policies[1].public_key);
                        if (node1 && node2) {
                            const c = Math.sqrt(channel.capacity / channelMinMax.max);

                            this.channelBufferService.thickness.data[i * 2] = c;
                            this.channelBufferService.thickness.data[i * 2 + 1] = c;
                            i++;
                        }
                        //}
                    });
                    this.channelBufferService.thickness.onUpdate.next(i * 2);
                }),
            ),
        { dispatch: false },
    );
}
