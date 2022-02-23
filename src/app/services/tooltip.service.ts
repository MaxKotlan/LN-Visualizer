import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';

interface Coordinates {
    x: number;
    y: number;
}

@Injectable({
    providedIn: 'root',
})
export class ToolTipService {
    private isOpenedSubject$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private tooltipCoords$: BehaviorSubject<Coordinates> = new BehaviorSubject({ x: 0, y: 0 });
    private tooltipTextSubject$: BehaviorSubject<string> = new BehaviorSubject('');

    public isOpened$: Observable<boolean> = this.isOpenedSubject$.asObservable();
    public tooltipText$: Observable<string> = this.tooltipTextSubject$.asObservable();

    public offsetX$: Observable<string> = this.tooltipCoords$
        .asObservable()
        .pipe(map((cords) => cords.x + 'px'));
    public offsetY$: Observable<string> = this.tooltipCoords$
        .asObservable()
        .pipe(map((cords) => cords.y + 'px'));

    constructor() {}

    public open(x, y, text) {
        this.isOpenedSubject$.next(true);
        this.tooltipCoords$.next({ x, y });
        this.tooltipTextSubject$.next(text);
    }

    public close() {
        this.isOpenedSubject$.next(false);
    }
}
