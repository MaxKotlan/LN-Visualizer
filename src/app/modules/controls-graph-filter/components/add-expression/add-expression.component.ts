import { Component, ViewChild } from '@angular/core';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { GenericChannelFilter, GenericNodeFilter } from 'src/app/modules/filter-templates';
import { setEvalMode, setScriptSource, setScriptType } from '../../actions';
import * as filterActions from '../../actions/filter.actions';
import { GraphFilterState } from '../../reducer';
import { scriptEvalMode, scriptSource, scriptType } from '../../selectors/filter-view.selectors';
import { FilterEvaluatorService } from '../../services/filter-evaluator.service';

export const channelDemoSource = `const btcPrice = await fetch('https://api.coinbase.com/v2/prices/spot?currency=USD')
.then(response => response.json())
.then(data => data.data.amount);

const satPrice = btcPrice / 100000000;

return (channel) =>
channel.capacity * satPrice > 23 && channel.capacity * satPrice < 25
`;

export const nodeDemoSource = `return (node) =>
node.channel_count >= 80 && node.channel_count <= 1804  
`;

@UntilDestroy()
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
        this.store$
            .select(scriptEvalMode)
            .pipe(untilDestroyed(this))
            .subscribe((evalMode) => {
                this._evalMode = evalMode;
            });

        this.store$
            .select(scriptSource)
            .pipe(untilDestroyed(this))
            .subscribe((source) => {
                this._source = source;
            });

        this.store$
            .select(scriptType)
            .pipe(untilDestroyed(this))
            .subscribe((scriptType) => {
                this._scriptType = scriptType;
                if (scriptType === 'channel') {
                    this.expressionEval = this.evalChannelExpression;
                    this.createFilter = this.createChannelFilter;
                }
                if (scriptType === 'node') {
                    this.expressionEval = this.evalNodeExpression;
                    this.createFilter = this.createNodeFilter;
                }
            });
    }

    public _evalMode: 'add' | 'type' = 'add';

    public get evalMode() {
        return this._evalMode;
    }

    public set evalMode(evalMode: 'add' | 'type') {
        this.store$.dispatch(setEvalMode({ value: evalMode }));
    }

    public get scriptType() {
        return this._scriptType;
    }
    public set scriptType(scriptType: 'node' | 'channel') {
        this.store$.dispatch(setScriptType({ value: scriptType }));
    }

    private _scriptType: 'node' | 'channel';

    public error: Error | undefined = undefined;
    public _source: string;
    public get source() {
        return this._source;
    }

    public set source(ss: string) {
        this.store$.dispatch(setScriptSource({ value: ss }));
    }

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
