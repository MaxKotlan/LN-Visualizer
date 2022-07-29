import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, tap } from 'rxjs';
import * as filterViewActions from '../actions/filter-view.actions';
import {
    channelDemoSource,
    nodeDemoSource,
} from '../components/add-expression/add-expression.component';

@Injectable()
export class FilterViewEffects {
    onScriptTypeChange$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(filterViewActions.setScriptType),

                map(({ value }) => value),
                map((scriptType) =>
                    filterViewActions.setScriptSource({
                        value: scriptType === 'channel' ? channelDemoSource : nodeDemoSource,
                    }),
                ),
            ),
        { dispatch: true },
    );

    constructor(private actions$: Actions) {}
}
