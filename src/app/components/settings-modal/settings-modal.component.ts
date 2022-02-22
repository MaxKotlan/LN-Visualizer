import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ScreenSizeService } from 'src/app/services/screen-size.service';

@Component({
    selector: 'app-settings-modal',
    templateUrl: './settings-modal.component.html',
    styleUrls: ['./settings-modal.component.scss'],
})
export class SettingsModalComponent {
    constructor(public dialogRef: MatDialogRef<SettingsModalComponent>) {}

    // public shouldRenderLabels$ = this.store$.select(shouldRenderLabels);
}
