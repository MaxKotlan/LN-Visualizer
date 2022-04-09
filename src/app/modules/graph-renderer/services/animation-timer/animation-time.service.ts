import { Injectable } from '@angular/core';
import { animationFrames, map, Observable, TimestampProvider } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AnimationTimeService {
    public customTSProvider: TimestampProvider;

    constructor() {
        let now = 0;
        this.customTSProvider = {
            now() {
                return now++;
            },
        };
        this.sinTime$ = animationFrames(this.customTSProvider).pipe(
            map(({ elapsed }) => Math.sin(elapsed * 0.01)),
        );
    }

    public sinTime$: Observable<number>;
}
