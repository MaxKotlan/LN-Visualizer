import { Injectable } from '@angular/core';
import { Actions, createEffect } from '@ngrx/effects';
import { catchError, map, of } from 'rxjs';
import { setAllPilotFlags } from '../actions';
import { PilotFlags } from '../reducer';
import { PilotFlagApiService } from '../services';

@Injectable({
    providedIn: 'root',
})
export class PilotFlagEffects {
    constructor(private actions$: Actions, private pilotFlagApiService: PilotFlagApiService) {}

    getPilotFlags$ = createEffect(() =>
        this.pilotFlagApiService.getApiConfig().pipe(
            map((pilotFlags: PilotFlags) => setAllPilotFlags({ value: pilotFlags })),
            catchError((e) => {
                console.warn('could not load remote pilot flags');
                return of();
            }),
        ),
    );
}
