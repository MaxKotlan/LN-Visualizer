import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PilotFlagModalComponent } from 'src/app/modules/pilot-flags/components';

@Component({
    selector: 'app-pilot-flag-button',
    templateUrl: './pilot-flag-button.component.html',
    styleUrls: ['./pilot-flag-button.component.scss'],
})
export class PilotFlagButtonComponent {
    constructor(public dialog: MatDialog) {}

    @Input() public inline: boolean = false;

    openDialog(): void {
        this.dialog.open(PilotFlagModalComponent, {
            maxWidth: null,
            panelClass: 'custom-pannel',
            height: '90vh',
        });
    }
}
