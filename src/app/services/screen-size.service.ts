import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ScreenSizeService {
    constructor(private observer: BreakpointObserver) {}

    public isMobile$: Observable<boolean> = this.observer
        .observe(Breakpoints.Handset)
        .pipe(map((bs) => bs.matches));

    public isDesktop$: Observable<boolean> = this.isMobile$.pipe(map((s) => !s));
}
