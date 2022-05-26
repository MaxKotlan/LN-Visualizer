import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { LndChannel } from 'api/src/models';
import { Observable } from 'rxjs';
import {
    ChannelEvaluationFunction,
    Filter,
    NodeEvaluationFunction,
} from 'src/app/modules/controls-graph-filter/types/filter.interface';
import { GraphState } from 'src/app/modules/graph-renderer/reducer';
import { MinMax } from 'src/app/types/min-max-total.interface';
import { LndNodeWithPosition } from 'src/app/types/node-position.interface';
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
        this.scriptName = `quick-${key}`;
        this.isEnabled$ = this.store$.select(filterSelectors.isFilterActive(this.scriptName));
    }

    @Input() set minMax(minMax: MinMax) {
        this.minMaxLinear = minMax;
        this.minLog = Math.log10(this.minMaxLinear.min + 1);
        this.maxLog = Math.log10(this.minMaxLinear.max + 1);
        this.logStep = (this.maxLog - this.minLog) / 100;
        this.logValue = [
            (this.maxLog - this.minLog) / 4 + this.minLog,
            (3 * (this.maxLog - this.minLog)) / 4 + this.minLog,
        ];
    }

    public minLog = 0;
    public maxLog = 1;

    public minMaxLinear: MinMax;
    public logStep: number;
    public logValue: number[];

    @Input() public isNodeScript: boolean = false;
    @Input() public isPolicyScript: boolean = true;
    public objectKey: string;
    public label: string;
    public scriptName: string;
    public isEnabled: boolean;
    public isEnabled$: Observable<boolean>;

    public onInputChange(newValue: number, index) {
        this.logValue[index] = newValue;
    }

    public onEnableChange() {
        if (!this.isEnabled) {
            this.store$.dispatch(
                filterActions.removeChannelFilterByIssueId({ issueId: this.scriptName }),
            );
        } else {
            this.nodeOrChannelScript();
        }
    }

    updateScript() {
        this.isEnabled = true;
        this.nodeOrChannelScript();
    }

    public nodeOrChannelScript() {
        if (this.isNodeScript) this.updateNodeScript();
        else this.updateChannelScript();
    }

    public updateNodeScript() {
        this.store$.dispatch(
            filterActions.updateNodeFilterByIssueId({
                value: {
                    interpreter: 'javascript',
                    issueId: this.scriptName,
                    source: this.createNodeScriptSource(this.logValue),
                    function: this.createNodeScript(),
                } as Filter<NodeEvaluationFunction>,
            }),
        );
    }

    public updateChannelScript() {
        this.store$.dispatch(
            filterActions.updateChannelFilterByIssueId({
                value: {
                    interpreter: 'javascript',
                    issueId: this.scriptName,
                    source: this.isPolicyScript
                        ? this.createPolicyScriptSource(this.logValue)
                        : this.createNonPolicyScriptSource(this.logValue),
                    function: this.isPolicyScript
                        ? this.createPolicyScript()
                        : this.createNonPolicyScript(),
                } as Filter<ChannelEvaluationFunction>,
            }),
        );
    }

    public createNonPolicyScript() {
        return (channel: LndChannel) =>
            channel[this.objectKey] >= this.logToLinear(this.logValue[0]) &&
            channel[this.objectKey] <= this.logToLinear(this.logValue[1]);
    }

    public createPolicyScript() {
        return (channel: LndChannel) =>
            channel.policies.some(
                (p) =>
                    p[this.objectKey] >= this.logToLinear(this.logValue[0]) &&
                    p[this.objectKey] <= this.logToLinear(this.logValue[1]),
            );
    }

    public createNodeScript() {
        return (node: LndNodeWithPosition) =>
            node[this.objectKey] >= this.logToLinear(this.logValue[0]) &&
            node[this.objectKey] <= this.logToLinear(this.logValue[1]);
    }

    public createNodeScriptSource(value: number[]) {
        return `return (node) =>
    node.${this.objectKey} >= ${this.logToLinear(value[0])} && node.${
            this.objectKey
        } <= ${this.logToLinear(value[1])}                     
`;
    }

    public createNonPolicyScriptSource(value: number[]) {
        return `return (channel) =>
    channel.${this.objectKey} >= ${this.logToLinear(value[0])} && channel.${
            this.objectKey
        } <= ${this.logToLinear(value[1])}                     
`;
    }

    public createPolicyScriptSource(value: number[]) {
        return `return (channel) =>
  channel.policies.some(p =>
    p.${this.objectKey} >= ${this.logToLinear(value[0])} && p.${
            this.objectKey
        } <= ${this.logToLinear(value[1])} )                        
`;
    }

    public logToLinear(value: number) {
        return Math.round(Math.pow(10, value) - 1);
    }
}
