import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as controlsActions from './actions/controls.actions';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    title = 'LN-Visualizer';

    constructor(private store$: Store) {}

    ngOnInit() {
        this.store$.dispatch(controlsActions.loadSavedState());
    }
}
