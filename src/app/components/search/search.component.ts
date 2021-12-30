import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { searchGraph } from 'src/app/actions/controls.actions';
import { GraphState } from 'src/app/reducers/graph.reducer';
import { selectSearchString } from 'src/app/selectors/controls.selectors';
import { selectNodesSearchResults } from 'src/app/selectors/graph.selectors';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {

  constructor(private store$: Store<GraphState>){}

  public myControl: FormControl = new FormControl();

  public nodeSearchResults$ = this.store$.select(selectNodesSearchResults)
  public selectSearchString$ = this.store$.select(selectSearchString);

  onTextChange(event: any){
    if (!!event?.target?.value || event?.target?.value === '')
      this.store$.dispatch(searchGraph({searchText: event.target.value}))
    else if (event?.option?.value)
      this.store$.dispatch(searchGraph({searchText: event.option.value}))
  }
}
