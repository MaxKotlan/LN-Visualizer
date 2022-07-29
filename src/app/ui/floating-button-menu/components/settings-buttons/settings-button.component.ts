import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SettingsModalComponent } from '../../../settings/controls/components/settings-modal/settings-modal.component';

@Component({
    selector: 'app-settings',
    templateUrl: './settings-button.component.html',
    styleUrls: ['./settings-button.component.scss'],
})
export class SettingsButtonComponent {
    constructor(public dialog: MatDialog) {}

    @Input() public inline: boolean = false;

    openDialog(): void {
        this.dialog.open(SettingsModalComponent, {
            maxWidth: null,
            panelClass: 'custom-pannel',
            height: '90vh',
        });
    }
}
