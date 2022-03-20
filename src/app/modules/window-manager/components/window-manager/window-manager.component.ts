import { Component, OnInit } from '@angular/core';
import { ScreenSizeService } from 'src/app/modules/screen-size/services';

@Component({
    selector: 'app-window-manager',
    templateUrl: './window-manager.component.html',
    styleUrls: ['./window-manager.component.scss'],
})
export class WindowManagerComponent {
    constructor(public screenSizeService: ScreenSizeService) {}
}
