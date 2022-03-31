import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { donateLinkVisible } from 'src/app/modules/controls-misc/selectors/misc-controls.selectors';
import { DonateModalComponent } from '../donate-modal/donate-modal.component';

@Component({
    selector: 'app-donate-button',
    templateUrl: './donate-button.component.html',
    styleUrls: ['./donate-button.component.scss'],
})
export class DonateButtonComponent {
    constructor(public dialog: MatDialog, private store: Store<any>) {}

    public donateLinkVisible$ = this.store.select(donateLinkVisible);

    openDonateModal() {
        this.dialog.open(DonateModalComponent, {
            width: '300px',
            height: '411.68',
        });
    }
}
