import { Component, OnInit } from '@angular/core';
import { ScreenSizeService } from 'src/app/modules/screen-size/services';

@Component({
    selector: 'app-graph-view',
    templateUrl: './graph-view.component.html',
    styleUrls: ['./graph-view.component.scss'],
})
export class GraphViewComponent {
    constructor(public screenSizeService: ScreenSizeService) {}
}
