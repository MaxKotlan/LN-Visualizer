import { Component } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { GraphFilterState } from '../../reducer';
import * as filterSelectors from '../../selectors/filter.selectors';
import * as filterActions from '../../actions';
import { Filter } from '../../types/filter.interface';

@UntilDestroy()
@Component({
    selector: 'app-select-filter-key',
    templateUrl: './select-filter-key.component.html',
    styleUrls: ['./select-filter-key.component.scss'],
})
export class SelectFilterKeyComponent {
    constructor(private store$: Store<GraphFilterState>) {}

    public key: string;
    public operator: string;
    public operand: number;

    public options$: Observable<string[]> = this.store$.select(filterSelectors.channelFilterKeys);
    // public nodeFilterKeys$: Observable<string[]> = this.store$.select(
    //     filterSelectors.nodeFilterKeys,
    // );

    public operators$: Observable<string[]> = this.store$.select(filterSelectors.filterOperators);

    public createExpression() {
        if (!this.key || !this.operator || !this.operand) return;
        // this.store$.dispatch(
        //     filterActions.addChannelFilter({
        //         value: {
        //             keyname: this.key,
        //             operator: this.operator,
        //             operand: this.operand,
        //         } as Filter,
        //     }),
        // );
    }
}
