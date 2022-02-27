import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { GraphState } from 'src/app/modules/graph-renderer/reducer';
import {
    selectLoadingText,
    selectChunkRemainingPercentage,
} from 'src/app/modules/graph-renderer/selectors';

@Component({
    selector: 'app-loading-bar',
    templateUrl: './loading-bar.component.html',
    styleUrls: ['./loading-bar.component.scss'],
})
export class LoadingBarComponent {
    constructor(private store$: Store<GraphState>) {}

    public loadingText$: Observable<string> = this.store$.select(selectLoadingText);

    public percentageComplete$: Observable<number> = this.store$.select(
        selectChunkRemainingPercentage,
    );
}
