import { Injectable } from '@angular/core';
import { Actions, createEffect } from '@ngrx/effects';
import { map } from 'rxjs';
import { setAllPilotFlags } from '../actions';
import { PilotFlags } from '../reducer';
import { PilotFlagApiService } from '../services';

@Injectable()
export class PilotFlagEffects {
    constructor(private actions$: Actions, private pilotFlagApiService: PilotFlagApiService) {}

    getPilotFlags$ = createEffect(() =>
        this.pilotFlagApiService
            .getApiConfig()
            .pipe(map((pilotFlags: PilotFlags) => setAllPilotFlags({ value: pilotFlags }))),
    );
}
