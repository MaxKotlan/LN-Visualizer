import { Component, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSliderChange } from '@angular/material/slider';
import { Store } from '@ngrx/store';
import {
  gotoNode,
  minEdgesRecompute,
  renderEdges,
  renderNodes,
  searchGraph,
  sortOrderChange,
} from 'src/app/actions/controls.actions';
import { GraphState } from 'src/app/reducers/graph.reducer';
import { shouldRenderEdges, shouldRenderNodes } from 'src/app/selectors/controls.selectors';
import {
  selectFinalMatcheNodesFromSearch,
  selectNodesSearchResults,
} from 'src/app/selectors/graph.selectors';

@Component({
  selector: 'app-quick-controls',
  templateUrl: './quick-controls.component.html',
  styleUrls: ['./quick-controls.component.scss'],
})
export class QuickControlsComponent implements OnInit {
  options: string[] = ['One', 'Two', 'Three'];

  constructor(private store$: Store<GraphState>) {}

  public nodeSearchResults$ = this.store$.select(selectNodesSearchResults);
  public shouldRenderEdges$ = this.store$.select(shouldRenderEdges);
  public shouldRenderNodes$ = this.store$.select(shouldRenderNodes);
  public selectFinalMatcheNodesFromSearch$ = this.store$.select(selectFinalMatcheNodesFromSearch);

  ngOnInit() {}

  onTextChange(event: any) {
    if (event?.target?.value) this.store$.dispatch(searchGraph({ searchText: event.target.value }));
    if (event?.option?.value) this.store$.dispatch(searchGraph({ searchText: event.option.value }));
  }

  updateRenderNodes(event: MatCheckboxChange) {
    this.store$.dispatch(renderNodes({ value: event.checked }));
  }

  updateRenderEdges(event: MatCheckboxChange) {
    this.store$.dispatch(renderEdges({ value: event.checked }));
  }

  filterConnections(event: MatSliderChange) {
    this.store$.dispatch(minEdgesRecompute({ minEdges: event.value || 0 }));
  }

  connectionSortChanged(event: MatSlideToggleChange) {
    this.store$.dispatch(sortOrderChange({ ascending: event.checked }));
  }

  gotoNode() {
    this.store$.dispatch(gotoNode());
  }
}
