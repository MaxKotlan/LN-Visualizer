import { Component, Input, OnInit } from '@angular/core';
import { KeyValueNode } from 'src/app/modules/node-info/components';

@Component({
    selector: 'app-app-key-value-stats',
    templateUrl: './app-key-value-stats.component.html',
    styleUrls: ['./app-key-value-stats.component.scss'],
})
export class AppKeyValueStatsComponent {
    @Input() node: KeyValueNode;
    @Input() color: 'primary' | 'secondary' = 'primary';
}
