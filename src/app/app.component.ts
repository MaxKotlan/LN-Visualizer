import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as controlsActions from './modules/controls/actions';
import { ScreenSizeService } from './services/screen-size.service';
import * as graphActions from './modules/graph-renderer/actions';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    title = 'LN-Visualizer';

    constructor(private store$: Store, public screenSizeService: ScreenSizeService) {}

    ngOnInit() {
        this.store$.dispatch(controlsActions.loadSavedState());
    }

    public recomputeCanvasSize() {
        this.store$.dispatch(graphActions.recomputeCanvasSize());
    }
}
