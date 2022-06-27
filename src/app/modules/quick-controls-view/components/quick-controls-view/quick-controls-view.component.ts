import { Component } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { backendUnitFormat } from 'src/app/constants/display-units.constant';
import { setModalClose } from 'src/app/modules/window-manager/actions';
import { quickControlsId } from 'src/app/modules/window-manager/constants/windowIds';
import * as graphStatisticsSelector from '../../../graph-statistics/selectors';
import { QuickControl } from '../../reducer';
import { selectQuickControls } from '../../selectors';

@UntilDestroy()
@Component({
    selector: 'app-quick-controls-view',
    templateUrl: './quick-controls-view.component.html',
    styleUrls: ['./quick-controls-view.component.scss'],
})
export class QuickControlsViewComponent {
    constructor(private store$: Store) {
        this.store$
            .select(graphStatisticsSelector.globalStatisticsSelector)
            .pipe(untilDestroyed(this))
            .subscribe((newStatsState) => {
                this.statsKeys = Object.keys(newStatsState).filter(
                    (f) => f !== 'capacity' && f !== 'node_capacity' && f !== 'channel_count',
                );
                this.statsState = newStatsState;
            });
    }

    public controls$: Observable<QuickControl[]> = this.store$.select(selectQuickControls);

    public statsKeys;
    public statsState;

    public closeModal() {
        this.store$.dispatch(setModalClose({ modalId: quickControlsId }));
    }

    public backendUnitFormat = backendUnitFormat;
}
