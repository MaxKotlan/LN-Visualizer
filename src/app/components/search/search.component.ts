import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSliderChange } from '@angular/material/slider';
import { Store } from '@ngrx/store';
import { map, Observable, startWith } from 'rxjs';
import { gotoNode, minEdgesRecompute, renderEdges, searchGraph, sortOrderChange } from 'src/app/actions/graph.actions';
import { GraphState } from 'src/app/reducers/graph.reducer';
import { selectNodesSearchResults, selectSearchString } from 'src/app/selectors/graph.selectors';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  options: string[] = ['One', 'Two', 'Three'];

  constructor(private store$: Store<GraphState>){}

  public myControl: FormControl = new FormControl();

  public nodeSearchResults$ = this.store$.select(selectNodesSearchResults)

  ngOnInit() {
  }

  onTextChange(event: any){
    if (event?.target?.value)
      this.store$.dispatch(searchGraph({searchText: event.target.value}))
    if (event?.option?.value)
      this.store$.dispatch(searchGraph({searchText: event.option.value}))

  }

  checkboxFix(event: MatCheckboxChange){
    this.store$.dispatch(renderEdges({value: event.checked}))
  }

  filterConnections(event: MatSliderChange){
    this.store$.dispatch(minEdgesRecompute({minEdges: event.value || 0}))
  }

  connectionSortChanged(event: MatSlideToggleChange){    
    this.store$.dispatch(sortOrderChange({ascending: event.checked}))
  }

  gotoNode(){
    this.store$.dispatch(gotoNode());
  }

}
