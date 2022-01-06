import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { GraphState } from 'src/app/reducers/graph.reducer';
import { selectChunkRemainingPercentage } from 'src/app/selectors/graph.selectors';

@Component({
    selector: 'app-loading-bar',
    templateUrl: './loading-bar.component.html',
    styleUrls: ['./loading-bar.component.scss'],
})
export class LoadingBarComponent {
    constructor(private store$: Store<GraphState>) {}

    public percentageComplete$: Observable<number> = this.store$.select(
        selectChunkRemainingPercentage,
    );
}
