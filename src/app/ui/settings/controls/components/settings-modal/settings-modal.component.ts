import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-settings-modal',
    templateUrl: './settings-modal.component.html',
    styleUrls: ['./settings-modal.component.scss'],
})
export class SettingsModalComponent {
    constructor(public dialogRef: MatDialogRef<SettingsModalComponent>) {}
}
