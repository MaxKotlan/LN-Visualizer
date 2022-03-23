import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as filterActions from '../actions';
import * as graphActions from '../../graph-renderer/actions';
import { map, tap } from 'rxjs';

@Injectable()
export class FilterEffects {
    constructor(private actions$: Actions) {}

    //this is going to be expensive... must come back here and fix it later
    // generateFilters$ = createEffect(
    //     () =>
    //         this.actions$.pipe(
    //             ofType(graphActions.cacheProcessedChannelChunk),

    //             map((channelState) => {
    //                 const keySet: Set<string> = new Set();

    //                 channelState.channelSet.forEach((ch) => {
    //                     Object.keys(ch).forEach((chKey) => {
    //                         if (chKey !== 'policies') keySet.add(chKey);
    //                     });
    //                     ch.policies.forEach(
    //                         (policy) => Object.keys(policy).forEach((pkey) => keySet.add(pkey)),
    //                         // keySet.add(chKey)
    //                     );
    //                 });
    //                 return filterActions.setAllowedFilterKeys({ value: Array.from(keySet) });
    //             }),
    //         ),
    //     { dispatch: true },
    // );

    // generateFiltersNode$ = createEffect(
    //     () =>
    //         this.actions$.pipe(
    //             ofType(graphActions.cacheProcessedGraphNodeChunk),

    //             tap((channelState) => {
    //                 const keySet: Set<string> = new Set();

    //                 channelState.nodeSet.forEach((ch) => {
    //                     Object.keys(ch).forEach((chKey) => {
    //                         keySet.add(chKey);
    //                     });
    //                     // ch.policies.forEach(
    //                     //     (policy) => Object.keys(policy).forEach((pkey) => keySet.add(pkey)),
    //                     //     // keySet.add(chKey)
    //                     // );
    //                 });
    //                 console.log(Array.from(keySet));
    //                 //return filterActions.setAllowedFilterKeys({ value: Array.from(keySet) });
    //             }),
    //         ),
    //     { dispatch: false },
    // );
}
