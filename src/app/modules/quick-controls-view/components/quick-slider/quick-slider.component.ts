import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { LndChannel } from 'api/src/models';
import { Observable } from 'rxjs';
import { Filter } from 'src/app/modules/controls-graph-filter/types/filter.interface';
import { GraphState } from 'src/app/modules/graph-renderer/reducer';
import { MinMax } from 'src/app/types/min-max-total.interface';
import * as filterActions from '../../../controls-graph-filter/actions';
import * as filterSelectors from '../../../controls-graph-filter/selectors/filter.selectors';

@Component({
    selector: 'app-quick-slider',
    templateUrl: './quick-slider.component.html',
    styleUrls: ['./quick-slider.component.scss'],
})
export class QuickSliderComponent {
    constructor(private store$: Store<GraphState>) {}

    @Input() set key(key: string) {
        this.label = key.replace(/_/g, ' ');
        this.objectKey = key;
        this.scriptName = `quick-${key}-2`;
        this.isEnabled$ = this.store$.select(filterSelectors.isFilterActive(this.scriptName));
    }

    @Input() set minMax(minMax: MinMax) {
        this.minMaxLinear = minMax;
        this.minLog = 0; //this.minMaxLinear.min < 0 ? 0 : Math.log2(this.minMaxLinear.min);
        this.maxLog = Math.log2(this.minMaxLinear.max);
        this.logStep = this.maxLog / 100;
        this.logValue = [this.maxLog / 4, (3 * this.maxLog) / 4];
    }

    public minLog = 0;
    public maxLog = 1;

    public minMaxLinear: MinMax;
    public logStep: number;
    public logValue: number[];

    @Input() public isPolicyScript: boolean = true;
    public objectKey: string;
    public label: string;
    public scriptName: string;
    public isEnabled: boolean;
    public isEnabled$: Observable<boolean>;

    public onEnableChange() {
        if (!this.isEnabled) {
            this.store$.dispatch(filterActions.removeFilterByIssueId({ issueId: this.scriptName }));
        } else {
            this.store$.dispatch(
                filterActions.updateFilterByIssueId({
                    value: {
                        interpreter: 'javascript',
                        issueId: this.scriptName,
                        source: this.isPolicyScript
                            ? this.createPolicyScriptSource(this.logValue)
                            : this.createNonPolicyScriptSource(this.logValue),
                        function: this.isPolicyScript
                            ? this.createPolicyScript()
                            : this.createNonPolicyScript(),
                    } as Filter,
                }),
            );
        }
    }

    updateScript() {
        this.isEnabled = true;
        this.store$.dispatch(
            filterActions.updateFilterByIssueId({
                value: {
                    interpreter: 'javascript',
                    issueId: this.scriptName,
                    source: this.isPolicyScript
                        ? this.createPolicyScriptSource(this.logValue)
                        : this.createNonPolicyScriptSource(this.logValue),
                    function: this.isPolicyScript
                        ? this.createPolicyScript()
                        : this.createNonPolicyScript(),
                } as Filter,
            }),
        );
    }

    public createNonPolicyScript() {
        return (channel: LndChannel) =>
            channel[this.objectKey] >= this.logToLinear(this.logValue[0]) &&
            channel[this.objectKey] <= this.logToLinear(this.logValue[1]) + 1;
    }

    public createPolicyScript() {
        return (channel: LndChannel) =>
            channel.policies.some(
                (p) =>
                    p[this.objectKey] >= this.logToLinear(this.logValue[0]) &&
                    p[this.objectKey] <= this.logToLinear(this.logValue[1]) + 1,
            );
    }

    public createNonPolicyScriptSource(value: number[]) {
        return `return (channel) =>
    channel.${this.objectKey} >= ${this.logToLinear(value[0])} && channel.${this.objectKey} <= ${
            this.logToLinear(value[1]) + 1
        }                     
`;
    }

    public createPolicyScriptSource(value: number[]) {
        return `return (channel) =>
  channel.policies.some(p =>
    p.${this.objectKey} >= ${this.logToLinear(value[0])} && p.${this.objectKey} <= ${
            this.logToLinear(value[1]) + 1
        } )                        
`;
    }

    public logToLinear(value: number) {
        return Math.round(Math.pow(2, value) - 1);
    }
}
