import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { setModalOpen } from 'src/app/ui/window-manager/actions';
import { quickControlsId } from 'src/app/ui/window-manager/constants/windowIds';
import { WindowManagerState } from 'src/app/ui/window-manager/reducers';
import * as windowManagementSelectors from 'src/app/ui/window-manager/selectors';

@Component({
    selector: 'app-sidenav-open-button',
    templateUrl: './sidenav-open-button.component.html',
    styleUrls: ['./sidenav-open-button.component.scss'],
})
export class SidenavOpenButtonComponent {
    constructor(private store$: Store<WindowManagerState>) {}

    public openModal() {
        this.store$.dispatch(setModalOpen({ modalId: quickControlsId }));
    }

    shouldShowButton$: Observable<boolean> = this.store$.select(
        windowManagementSelectors.selectModalStateBool(quickControlsId),
    );
}
