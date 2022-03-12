import { Component, Input, OnInit } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
    selector: 'app-sidenav-open-button',
    templateUrl: './sidenav-open-button.component.html',
    styleUrls: ['./sidenav-open-button.component.scss'],
})
export class SidenavOpenButtonComponent {
    @Input() matDrawer: MatDrawer;
}
