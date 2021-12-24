import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { map, Observable, startWith } from 'rxjs';
import { searchGraph } from 'src/app/actions/graph.actions';
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
    this.store$.dispatch(searchGraph({searchText: event.target.value}))
  }

}
