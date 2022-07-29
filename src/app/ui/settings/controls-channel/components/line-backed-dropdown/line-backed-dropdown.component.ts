import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { setLineBackend } from '../../actions';
import { selectLineBackend } from '../../selectors';

@Component({
    selector: 'app-line-backed-dropdown',
    templateUrl: './line-backed-dropdown.component.html',
    styleUrls: ['./line-backed-dropdown.component.scss'],
})
export class LineBackedDropdownComponent {
    constructor(private store$: Store) {}

    lineOptions = ['gl-line', 'line-mesh'];

    public lineBackend$ = this.store$.select(selectLineBackend);

    valueChanged(event) {
        this.store$.dispatch(setLineBackend({ value: event }));
    }
}
