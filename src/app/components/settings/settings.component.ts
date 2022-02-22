import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SettingsModalComponent } from '../settings-modal/settings-modal.component';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
    constructor(public dialog: MatDialog) {}

    @Input() public inline: boolean = false;

    openDialog(): void {
        this.dialog.open(SettingsModalComponent, {
            maxWidth: null,
            panelClass: 'custom-pannel',
        });
    }
}
