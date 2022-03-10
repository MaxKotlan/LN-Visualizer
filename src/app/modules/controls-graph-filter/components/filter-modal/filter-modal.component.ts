import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { LndChannel } from 'api/src/models';
import { FilterEvaluatorService } from '../../services/filter-evaluator.service';

@Component({
    selector: 'app-filter-modal',
    templateUrl: './filter-modal.component.html',
    styleUrls: ['./filter-modal.component.scss'],
})
export class FilterModalComponent {
    constructor(
        public dialogRef: MatDialogRef<FilterModalComponent>,
        public filterEval: FilterEvaluatorService,
    ) {}

    public error: Error | undefined = undefined;

    public expressionEval(input: any) {
        try {
            this.filterEval.evaluateExpression({ capacity: 32 } as unknown as LndChannel, input);
            this.error = undefined;
        } catch (e) {
            this.error = e;
        }
    }

    public expression: string;
}
