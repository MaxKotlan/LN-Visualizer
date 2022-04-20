import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { GraphState } from 'src/app/modules/graph-renderer/reducer';
import { isRequestInitiating } from 'src/app/modules/graph-renderer/selectors';

@Component({
    selector: 'app-loading-spinner',
    templateUrl: './loading-spinner.component.html',
    styleUrls: ['./loading-spinner.component.scss'],
})
export class LoadingSpinnerComponent {
    constructor(private store$: Store<GraphState>) {}

    public IsRequestInitiating$ = this.store$.select(isRequestInitiating);
}
