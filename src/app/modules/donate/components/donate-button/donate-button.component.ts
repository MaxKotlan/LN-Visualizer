import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DonateModalComponent } from '../donate-modal/donate-modal.component';

@Component({
    selector: 'app-donate-button',
    templateUrl: './donate-button.component.html',
    styleUrls: ['./donate-button.component.scss'],
})
export class DonateButtonComponent {
    constructor(public dialog: MatDialog) {}

    openDonateModal() {
        this.dialog.open(DonateModalComponent, {
            width: '300px',
            height: '411.68',
        });
    }
}
