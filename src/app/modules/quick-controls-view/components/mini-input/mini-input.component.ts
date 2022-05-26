import { Component, Input, OnInit, Output, Pipe } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-mini-input',
    templateUrl: './mini-input.component.html',
    styleUrls: ['./mini-input.component.scss'],
})
export class MiniInputComponent {
    @Input() value;
}
