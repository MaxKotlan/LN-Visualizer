import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { createAlert } from '../../actions/alerts.actions';
import { AlertsState } from '../../reducers';
import { selectTopAlert } from '../../selectors/alerts.selectors';

@Component({
    selector: 'app-alerts-banner',
    templateUrl: './alerts-banner.component.html',
    styleUrls: ['./alerts-banner.component.scss'],
})
export class AlertsBannerComponent {
    constructor(private store$: Store<AlertsState>) {}

    public topAlert = this.store$.select(selectTopAlert);
}
