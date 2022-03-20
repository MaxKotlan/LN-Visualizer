import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { setModalClose } from 'src/app/modules/window-manager/actions';
import { quickControlsId } from 'src/app/modules/window-manager/constants/windowIds';
import { WindowManagerState } from 'src/app/modules/window-manager/reducers';

@Component({
    selector: 'app-quick-controls-view',
    templateUrl: './quick-controls-view.component.html',
    styleUrls: ['./quick-controls-view.component.scss'],
})
export class QuickControlsViewComponent {
    constructor(private store$: Store<WindowManagerState>) {}

    public closeModal() {
        this.store$.dispatch(setModalClose({ modalId: quickControlsId }));
    }
}
