import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { animationFrames, map, Observable, of, switchMap, TimestampProvider } from 'rxjs';
import { selectShowGraphAnimation } from 'src/app/modules/controls-renderer/selectors';

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
        this.sinTime$ = this.store$
            .select(selectShowGraphAnimation)
            .pipe(
                switchMap((shouldShow) =>
                    shouldShow
                        ? animationFrames(this.customTSProvider).pipe(
                              map(({ elapsed }) => Math.sin(elapsed * 0.01)),
                          )
                        : of(0),
                ),
            );
    }

    public sinTime$: Observable<number>;
}
