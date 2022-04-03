import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { createAlert, dismissAlert } from '../../actions/alerts.actions';
import { AlertsState } from '../../reducers';
import { selectTopAlert } from '../../selectors/alerts.selectors';

@Component({
    selector: 'app-alerts-banner',
    templateUrl: './alerts-banner.component.html',
    styleUrls: ['./alerts-banner.component.scss'],
})
export class AlertsBannerComponent {
    constructor(private store$: Store<AlertsState>) {
        // this.store$.dispatch(
        //     createAlert({
        //         alert: {
        //             id: 'test-1',
        //             type: 'danger',
        //             message: 'error this app sucks and is not working',
        //         },
        //     }),
        // );
        // this.store$.dispatch(
        //     createAlert({
        //         alert: { id: 'test-2', type: 'warning', message: 'omegalaul' },
        //     }),
        // );
    }
    public topAlert = this.store$.select(selectTopAlert);

    public closeAlert(id: string) {
        this.store$.dispatch(dismissAlert({ id }));
    }
}
