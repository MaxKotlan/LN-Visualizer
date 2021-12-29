import { Component, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSliderChange } from '@angular/material/slider';
import { Store } from '@ngrx/store';
import { renderEdges, renderLabels, renderNodes, resetControlsToDefault, setNodeSize, setPointAttenuation, setPointUseIcon } from 'src/app/actions/controls.actions';
import { ControlsState } from 'src/app/reducers/controls.reducer';
import { selectNodeSize, selectPointAttenuation, selectPointUseIcon, shouldRenderEdges, shouldRenderLabels, shouldRenderNodes } from 'src/app/selectors/controls.selectors';

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

  public selectNodeSize$ = this.store$.select(selectNodeSize);
  public selectPointAttenuation$ = this.store$.select(selectPointAttenuation);
  public selectPointUseIcon$ = this.store$.select(selectPointUseIcon);
  public shouldRenderEdges$ = this.store$.select(shouldRenderEdges);
  public shouldRenderNodes$ = this.store$.select(shouldRenderNodes);
  public shouldRenderLabels$ = this.store$.select(shouldRenderLabels);

  setNodeSize(event: MatSliderChange){
    this.store$.dispatch(setNodeSize({nodeSize: event.value || 1}))
  }

  setShouldRenderNodes(event: MatCheckboxChange){
    this.store$.dispatch(renderNodes({value: event.checked}))
  }

  setShouldRenderEdges(event: MatCheckboxChange){
    this.store$.dispatch(renderEdges({value: event.checked}))
  }

  setShouldRenderLabels(event: MatCheckboxChange){
    this.store$.dispatch(renderLabels({value: event.checked}))
  }

  setPointAttenuation(event: MatCheckboxChange){
    this.store$.dispatch(setPointAttenuation({value: event.checked}))
  }

  setPointUseIcon(event: MatCheckboxChange){
    this.store$.dispatch(setPointUseIcon({value: event.checked}))
  }

  resetSettingsToDefault(){
    this.store$.dispatch(resetControlsToDefault())
  }

}
