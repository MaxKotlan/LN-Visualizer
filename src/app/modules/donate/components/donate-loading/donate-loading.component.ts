import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { DonateState } from '../../reducers';
import { selectIsLoading } from '../../selectors/donate.selectors';

@Component({
    selector: 'app-donate-loading',
    templateUrl: './donate-loading.component.html',
    styleUrls: ['./donate-loading.component.scss'],
})
export class DonateLoadingComponent {
    constructor(private store$: Store<DonateState>) {}
    public isLoading$ = this.store$.select(selectIsLoading);
}
