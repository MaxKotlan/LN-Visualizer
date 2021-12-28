import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SettingsModalComponent } from '../settings-modal/settings-modal.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {

  constructor(public dialog: MatDialog) { }

  openDialog(): void {
    console.log('jahsjhgafjhafgsjhasf')
    this.dialog.open(SettingsModalComponent, {width: '60vw', maxWidth: '1028px', height: '90vh', panelClass: 'custom-pannel'});
  }

}
