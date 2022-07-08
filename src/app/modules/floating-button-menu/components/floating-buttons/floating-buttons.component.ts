import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectDevModeEnabled } from 'src/app/modules/pilot-flags/selectors';

@Component({
    selector: 'app-floating-buttons',
    templateUrl: './floating-buttons.component.html',
    styleUrls: ['./floating-buttons.component.scss'],
})
export class FloatingButtonsComponent {
    constructor(private store$: Store<any>) {}

    public isDeveloperMode$ = this.store$.select(selectDevModeEnabled);
}
