import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
    animationFrames,
    map,
    Observable,
    of,
    switchMap,
    tap,
    TimestampProvider,
    withLatestFrom,
} from 'rxjs';
import {
    selectNodeTimeIntensity,
    selectShowGraphAnimation,
} from 'src/app/modules/controls-renderer/selectors';

@Injectable({
    providedIn: 'root',
})
export class AnimationTimeService {
    public customTSProvider: TimestampProvider;

    constructor(private store$: Store<any>) {
        let now = 0;
        this.customTSProvider = {
            now() {
                return now++;
            },
        };
        this.sinTime$ = this.store$.select(selectShowGraphAnimation).pipe(
            switchMap((shouldShow) =>
                shouldShow
                    ? animationFrames(this.customTSProvider).pipe(
                          withLatestFrom(this.store$.select(selectNodeTimeIntensity)),
                          map(([{ elapsed }, timeIntensity]) => Math.sin(elapsed * timeIntensity)),
                      )
                    : of(0),
            ),
        );
        this.cosTime$ = this.store$.select(selectShowGraphAnimation).pipe(
            switchMap((shouldShow) =>
                shouldShow
                    ? animationFrames(this.customTSProvider).pipe(
                          withLatestFrom(this.store$.select(selectNodeTimeIntensity)),
                          map(([{ elapsed }, timeIntensity]) => Math.cos(elapsed * timeIntensity)),
                      )
                    : of(0),
            ),
        );
    }

    public sinTime$: Observable<number>;
    public cosTime$: Observable<number>;
}
