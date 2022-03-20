import { Component, Input, OnInit } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
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
        this.minMaxLogarithmic = {
            min: Math.log10(this.minMaxLinear.min),
            max: Math.log10(this.minMaxLinear.max),
        };
        this.logStep = this.minMaxLogarithmic.max / 100;
        this.logValue = this.minMaxLogarithmic.max / 2;
    }

    public minMaxLinear: MinMax;
    public minMaxLogarithmic: MinMax;
    public logStep: number;
    public logValue: number;

    public isPolicyScript: boolean = true;
    public objectKey: string;
    public label: string;
    public scriptName: string;
    public isEnabled: boolean;
    public isEnabled$: Observable<boolean>;

    public value: number;

    public onEnableChange() {
        if (!this.isEnabled) {
            this.store$.dispatch(filterActions.removeFilterByIssueId({ issueId: this.scriptName }));
        } else {
            this.store$.dispatch(
                filterActions.updateFilterByIssueId({
                    value: {
                        interpreter: 'javascript',
                        source: this.createScriptSource(this.logValue),
                        function: this.createScript(),
                        issueId: this.scriptName,
                    } as Filter,
                }),
            );
        }
    }

    updateScript(event: MatSliderChange) {
        this.isEnabled = true;
        this.store$.dispatch(
            filterActions.updateFilterByIssueId({
                value: {
                    interpreter: 'javascript',
                    issueId: 'quick-capacity',
                    function: this.createScript(),
                    source: this.createScriptSource(event.value),
                } as Filter,
            }),
        );
    }

    public createScript() {
        return (channel: LndChannel) =>
            channel.policies.some((p) => p[this.objectKey] > Math.pow(10, this.logValue));
    }

    public createScriptSource(value: number) {
        return `return (channel) =>
  channel.policies.some(p => p.${this.objectKey} > ${Math.pow(
            10,
            this.logValue,
        )})                        
`;
    }
}
