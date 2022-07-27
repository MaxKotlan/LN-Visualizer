import { Component, Input, OnInit } from '@angular/core';
import { KeyValueNode } from '../node-info';

@Component({
    selector: 'app-key-value',
    templateUrl: './key-value.component.html',
    styleUrls: ['./key-value.component.scss'],
})
export class KeyValueComponent {
    @Input() node: KeyValueNode;
    @Input() color: 'primary' | 'secondary' = 'primary';
}
