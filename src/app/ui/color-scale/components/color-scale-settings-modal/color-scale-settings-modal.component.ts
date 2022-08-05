import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { colorRangeMinMaxEnabled$ } from 'src/app/ui/pilot-flags/selectors';

@Component({
    selector: 'app-color-scale-settings-modal',
    templateUrl: './color-scale-settings-modal.component.html',
    styleUrls: ['./color-scale-settings-modal.component.scss'],
})
export class ColorScaleSettingsModalComponent {
    constructor(private store: Store) {}

    public colorRangeMinMaxEnabled$ = this.store.select(colorRangeMinMaxEnabled$);
}
