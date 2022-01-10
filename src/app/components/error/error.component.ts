import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { requestGraph } from 'src/app/actions/graph.actions';
import { GraphState } from 'src/app/reducers/graph.reducer';

@Component({
    selector: 'app-error',
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.scss'],
})
export class ErrorComponent {
    constructor(private store$: Store<GraphState>) {}

    retryRequest() {
        this.store$.dispatch(requestGraph());
    }
}
