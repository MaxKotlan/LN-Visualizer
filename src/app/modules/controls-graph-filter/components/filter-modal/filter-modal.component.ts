import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
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

    public expressionEval(input: any) {
        this.filterEval.evaluateExpression(input);
    }

    public expression: string;
}