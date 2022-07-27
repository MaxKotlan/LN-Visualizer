import { Injectable } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import {
    animationFrames,
    map,
    Observable,
    of,
    shareReplay,
    switchMap,
    tap,
    TimestampProvider,
    withLatestFrom,
} from 'rxjs';
import {
    selectNodeTimeIntensity,
    selectShowGraphAnimation,
} from 'src/app/ui/controls-renderer/selectors';

@UntilDestroy()
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
            untilDestroyed(this),
            switchMap((shouldShow) =>
                shouldShow
                    ? animationFrames(this.customTSProvider).pipe(
                          withLatestFrom(this.store$.select(selectNodeTimeIntensity)),
                          map(([{ elapsed }, timeIntensity]) => Math.sin(elapsed * timeIntensity)),
                      )
                    : of(0),
            ),
            shareReplay(1),
        );
        this.cosTime$ = this.store$.select(selectShowGraphAnimation).pipe(
            untilDestroyed(this),
            switchMap((shouldShow) =>
                shouldShow
                    ? animationFrames(this.customTSProvider).pipe(
                          withLatestFrom(this.store$.select(selectNodeTimeIntensity)),
                          map(([{ elapsed }, timeIntensity]) => Math.cos(elapsed * timeIntensity)),
                      )
                    : of(0),
            ),
            shareReplay(1),
        );
    }

    public sinTime$: Observable<number>;
    public cosTime$: Observable<number>;
}
