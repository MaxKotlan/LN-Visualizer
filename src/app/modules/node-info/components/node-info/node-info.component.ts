import { Component, OnInit } from '@angular/core';
import { NodeSearchEffects } from 'src/app/modules/graph-renderer/effects/node-search.effects';

@Component({
    selector: 'app-node-info',
    templateUrl: './node-info.component.html',
    styleUrls: ['./node-info.component.scss'],
})
export class NodeInfoComponent {
    constructor(public nodeSearchEffects: NodeSearchEffects) {}
}
