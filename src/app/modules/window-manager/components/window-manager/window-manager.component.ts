import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { NodeSearchEffects } from 'src/app/modules/graph-renderer/effects/node-search.effects';
import { ScreenSizeService } from 'src/app/modules/screen-size/services';
import * as graphActions from '../../../graph-renderer/actions';
import * as windowManagementActions from '../../actions';
import { filterScriptsId, quickControlsId } from '../../constants/windowIds';
import { WindowManagerState } from '../../reducers';
import * as windowManagementSelectors from '../../selectors';

@Component({
    selector: 'app-window-manager',
    templateUrl: './window-manager.component.html',
    styleUrls: ['./window-manager.component.scss'],
})
export class WindowManagerComponent {
    constructor(
        public screenSizeService: ScreenSizeService,
        private store$: Store<WindowManagerState>,
    ) {}

    shouldShowQuickControls$: Observable<boolean> = this.store$.select(
        windowManagementSelectors.selectModalStateBool(quickControlsId),
    );

    shouldShowFilterScriptsSidebar$: Observable<boolean> = this.store$.select(
        windowManagementSelectors.shouldShowSidebar(filterScriptsId),
    );

    public closeQuickControls() {
        this.store$.dispatch(windowManagementActions.setModalClose({ modalId: quickControlsId }));
    }

    public openQuickControls() {
        this.store$.dispatch(windowManagementActions.setModalOpen({ modalId: quickControlsId }));
    }

    public closeFilters() {
        this.store$.dispatch(windowManagementActions.setModalClose({ modalId: filterScriptsId }));
    }

    public recomputeCanvas() {
        this.store$.dispatch(graphActions.recomputeCanvasSize());
    }
}
