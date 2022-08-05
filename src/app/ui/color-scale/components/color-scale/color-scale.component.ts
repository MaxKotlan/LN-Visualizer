import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { combineLatest, Observable } from 'rxjs';
import { ColorScaleSettingsModalComponent } from '../color-scale-settings-modal/color-scale-settings-modal.component';
const colormap = require('colormap');

@UntilDestroy()
@Component({
    selector: 'app-color-scale',
    templateUrl: './color-scale.component.html',
    styleUrls: ['./color-scale.component.scss'],
})
export class ColorScaleComponent implements OnInit {
    constructor(private modalDialog: MatDialog) {}

    public currentColorMapHex: string[];
    public backgrounColor: string;
    public divisions: number[];

    @Input() label: string;
    @Input() shouldShowColorRange: boolean;

    @Input() public intervals: number = 10;
    public shades: number = 20;

    @Input() set colorMapName(newColorMapName: string) {
        this.currentColorMapHex = colormap({
            colormap: newColorMapName,
            nshades: this.shades,
            format: 'hex',
            alpha: 1,
        });
        this.backgrounColor =
            'background-image: linear-gradient( ' +
            this.currentColorMapHex.reverse().join(', ') +
            ');';
    }

    @Input() minRange$: Observable<number>;
    @Input() maxRange$: Observable<number>;
    @Input() useLogScale$: Observable<boolean>;

    ngOnInit(): void {
        combineLatest([this.minRange$, this.maxRange$, this.useLogScale$])
            .pipe(untilDestroyed(this))
            .subscribe(([min, max, isLogScale]) => {
                this.divisions = [];
                for (let i = 0; i < this.intervals + 1; i++) {
                    let computed;
                    if (isLogScale) {
                        const maxLog = Math.log10(max + 1);
                        const minLog = Math.log10(min + 1);
                        const maxMinLogScale = maxLog - minLog;
                        const difference = maxMinLogScale / this.intervals;
                        const log = maxLog - i * difference;
                        computed = Math.round(Math.pow(10, log) - 1) || 0;
                    } else {
                        const difference = (max - min) / this.intervals;
                        computed = max - i * difference;
                    }

                    this.divisions.push(computed);
                }
            });
    }

    public openSettings() {
        this.modalDialog.open(ColorScaleSettingsModalComponent);
    }
}
