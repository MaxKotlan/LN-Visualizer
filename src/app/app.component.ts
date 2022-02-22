import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as controlsActions from './actions/controls.actions';
import * as graphActions from './actions/graph.actions';
import { ScreenSizeService } from './services/screen-size.service';

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
        this.store$.dispatch(graphActions.initializeGraphSyncProcess());
    }
}
