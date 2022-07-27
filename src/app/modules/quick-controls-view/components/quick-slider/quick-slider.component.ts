import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UnitLabelOrNumber } from 'src/app/constants/display-units.constant';
import {
    ChannelMinMaxFilter,
    NodeMinMaxFilter,
    PolicyMinMaxFilter,
} from 'src/app/filter-engine/filter-templates';
import { GraphState } from 'src/app/renderer/graph-renderer/reducer';
import { pilotIsUnitConversionsEnabled$ } from 'src/app/modules/pilot-flags/selectors/pilot-flags.selectors';
import { FinalConverterWrapper } from 'src/app/modules/unit-conversions/service';
import { MinMaxTotal } from 'src/app/types/min-max-total.interface';
import * as filterActions from 'src/app/filter-engine/controls-graph-filter/actions';
import * as filterSelectors from 'src/app/filter-engine/controls-graph-filter/selectors/filter.selectors';

@Component({
    selector: 'app-quick-slider',
    templateUrl: './quick-slider.component.html',
    styleUrls: ['./quick-slider.component.scss'],
    providers: [FinalConverterWrapper],
})
export class QuickSliderComponent {
    constructor(
        public store$: Store<GraphState>,
        public finalConverterWrapper: FinalConverterWrapper,
        private policyMinMaxFilter: PolicyMinMaxFilter,
        private channelMinMaxFilter: ChannelMinMaxFilter,
        private nodeMinMaxFilter: NodeMinMaxFilter,
    ) {}

    public isPilotFlagEnabled$ = this.store$.select(pilotIsUnitConversionsEnabled$);

    @Input() set key(key: string) {
        this.label = key.replace(/_/g, ' ');
        this.objectKey = key;
        this.scriptName = `quick-${key}`;
        this.isEnabled$ = this.store$.select(filterSelectors.isFilterActive(this.scriptName));
    }

    @Input() set minMax(minMax: MinMaxTotal) {
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

    public minMaxLinear: MinMaxTotal;
    public logStep: number;
    public logValue: number[];

    @Input() public isNodeScript: boolean = false;
    @Input() public isPolicyScript: boolean = true;
    @Input() public isCurrency: boolean = false;
    @Input() public set baseUnit(baseUnit: UnitLabelOrNumber) {
        this.finalConverterWrapper.setBaseUnit(baseUnit);
    }

    public objectKey: string;
    public label: string;
    public scriptName: string;
    public isEnabled: boolean;
    public isEnabled$: Observable<boolean>;

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
                value: this.nodeMinMaxFilter.createFilter(
                    this.objectKey,
                    this.logToLinear(this.logValue[0]),
                    this.logToLinear(this.logValue[1]),
                ),
            }),
        );
    }

    public updateChannelScript() {
        this.store$.dispatch(
            filterActions.updateChannelFilterByIssueId({
                value: this.isPolicyScript
                    ? this.policyMinMaxFilter.createFilter(
                          this.objectKey,
                          this.logToLinear(this.logValue[0]),
                          this.logToLinear(this.logValue[1]),
                      )
                    : this.channelMinMaxFilter.createFilter(
                          this.objectKey,
                          this.logToLinear(this.logValue[0]),
                          this.logToLinear(this.logValue[1]),
                      ),
            }),
        );
    }

    public logToLinear(value: number) {
        return Math.round(Math.pow(10, value) - 1);
    }
}
