import { Component, ViewChild } from '@angular/core';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import { Store } from '@ngrx/store';
import { GenericChannelFilter, GenericNodeFilter } from 'src/app/modules/filter-templates';
import * as filterActions from '../../actions/filter.actions';
import { GraphFilterState } from '../../reducer';
import { FilterEvaluatorService } from '../../services/filter-evaluator.service';

const channelDemoSource = `const btcPrice = await fetch('https://api.coinbase.com/v2/prices/spot?currency=USD')
.then(response => response.json())
.then(data => data.data.amount);

const satPrice = btcPrice / 100000000;

return (channel) =>
channel.capacity * satPrice > 23 && channel.capacity * satPrice < 25
`;

const nodeDemoSource = `return (node) =>
node.channel_count >= 80 && node.channel_count <= 1804  
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
        private genericNodeFilter: GenericNodeFilter,
    ) {
        this.scriptType = 'channel';
    }

    public evalMode: 'add' | 'type' = 'add';
    public get scriptType() {
        return this._scriptType;
    }
    public set scriptType(scriptType: 'node' | 'channel') {
        this._scriptType = scriptType;
        if (scriptType === 'channel') {
            this.source = channelDemoSource;
            this.expressionEval = this.evalChannelExpression;
            this.createFilter = this.createChannelFilter;
        }
        if (scriptType === 'node') {
            this.source = nodeDemoSource;
            this.expressionEval = this.evalNodeExpression;
            this.createFilter = this.createNodeFilter;
        }
    }

    private _scriptType: 'node' | 'channel';

    public error: Error | undefined = undefined;
    public source: string;

    public expressionEval: Function;
    public createFilter: Function;

    public async evalNodeExpression(input: string) {
        try {
            await this.genericNodeFilter.expressionEval(input);
            this.error = undefined;
        } catch (e) {
            this.error = e;
        }
    }

    public async createNodeFilter() {
        try {
            const filter = await this.genericNodeFilter.createFilter(this.source);
            this.store$.dispatch(filterActions.addNodeFilter({ value: filter }));
            this.error = undefined;
        } catch (e) {
            this.error = e;
        }
    }

    public async evalChannelExpression(input: string) {
        try {
            await this.genericChannelFilter.expressionEval(input);
            this.error = undefined;
        } catch (e) {
            this.error = e;
        }
    }

    public async createChannelFilter() {
        try {
            const filter = await this.genericChannelFilter.createFilter(this.source);
            this.store$.dispatch(filterActions.addChannelFilter({ value: filter }));
            this.error = undefined;
        } catch (e) {
            this.error = e;
        }
    }
}
