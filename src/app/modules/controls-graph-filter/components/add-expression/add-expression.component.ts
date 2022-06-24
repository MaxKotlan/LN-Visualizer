import { Component, ViewChild } from '@angular/core';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import { Store } from '@ngrx/store';
import { GenericChannelFilter } from 'src/app/modules/filter-templates';
import * as filterActions from '../../actions/filter.actions';
import { GraphFilterState } from '../../reducer';
import { FilterEvaluatorService } from '../../services/filter-evaluator.service';

const demoSource = `const btcPrice = await fetch('https://api.coinbase.com/v2/prices/spot?currency=USD')
.then(response => response.json())
.then(data => data.data.amount);

const satPrice = btcPrice / 100000000;

return (channel) =>
channel.capacity * satPrice > 23 && channel.capacity * satPrice < 25
`;

@Component({
    selector: 'app-add-expression',
    templateUrl: './add-expression.component.html',
    styleUrls: ['./add-expression.component.scss'],
})
export class AddExpressionComponent {
    constructor(
        public filterEval: FilterEvaluatorService,
        private store$: Store<GraphFilterState>,
        private genericChannelFilter: GenericChannelFilter,
    ) {}

    public evalMode: 'add' | 'type' = 'add';
    public scriptType: 'node' | 'channel' = 'channel';
    public error: Error | undefined = undefined;
    public source: string = demoSource;

    public async expressionEval(input: string) {
        try {
            await this.genericChannelFilter.expressionEval(input);
            this.error = undefined;
        } catch (e) {
            this.error = e;
        }
    }

    public async createFilter() {
        try {
            const filter = await this.genericChannelFilter.createFilter(this.source);
            this.store$.dispatch(filterActions.addChannelFilter({ value: filter }));
            this.error = undefined;
        } catch (e) {
            this.error = e;
        }
    }
}
