import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSliderChange } from '@angular/material/slider';
import { Store } from '@ngrx/store';
import { setNodeSize } from 'src/app/actions/controls.actions';
import { ControlsState } from 'src/app/reducers/controls.reducer';

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  styleUrls: ['./settings-modal.component.scss']
})
export class SettingsModalComponent {
  constructor(
    public dialogRef: MatDialogRef<SettingsModalComponent>,
    private store$: Store<ControlsState>
  ) { }

  setNodeSize(event: MatSliderChange){
    this.store$.dispatch(setNodeSize({nodeSize: event.value || 1}))
  }

}
