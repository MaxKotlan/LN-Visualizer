import { Component, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Store } from '@ngrx/store';
import { GenericControlsState } from 'src/app/modules/controls/reducers';
import { setDonateLinkVisible } from '../../actions';
import { donateLinkVisible } from '../../selectors/misc-controls.selectors';

@Component({
    selector: 'app-show-donate-link-checkbox',
    templateUrl: './show-donate-link-checkbox.component.html',
    styleUrls: ['./show-donate-link-checkbox.component.scss'],
})
export class ShowDonateLinkCheckboxComponent {
    constructor(private store: Store<GenericControlsState>) {}

    public donateLinkVisible$ = this.store.select(donateLinkVisible);

    setDonateLinkVisible(event: MatCheckboxChange) {
        this.store.dispatch(setDonateLinkVisible({ value: event.checked }));
    }
}
