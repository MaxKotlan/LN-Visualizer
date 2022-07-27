import { Component, Input, OnInit, Output, Pipe } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Component({
    selector: 'app-mini-input',
    templateUrl: './mini-input.component.html',
    styleUrls: ['./mini-input.component.scss'],
})
export class MiniInputComponent {
    private subject: Subject<number> = new Subject<number>();
    public _val: number;

    @Input() set value(value: number) {
        this._val = value;
    }

    @Output() valueChanged$: Observable<number> = this.subject.asObservable();

    public updateValue() {
        this.subject.next(this._val);
    }
}
