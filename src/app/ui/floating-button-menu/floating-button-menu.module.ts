import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../material';
import { MiscModule } from '../misc/misc.module';
import { PilotFlagsModule } from '../pilot-flags/pilot-flags.module';
import { TableViewModule } from '../table-view/table-view.module';
import {
    FilterButtonComponent,
    FloatingButtonsComponent,
    PilotFlagButtonComponent,
    SettingsButtonComponent,
    SidenavOpenButtonComponent,
} from './components';
import { StatsButtonComponent } from './components/stats-button/stats-button.component';
import { TableSearchButtonComponent } from './components/table-search-button/table-search-button.component';

@NgModule({
    declarations: [
        SettingsButtonComponent,
        FloatingButtonsComponent,
        FilterButtonComponent,
        SidenavOpenButtonComponent,
        StatsButtonComponent,
        PilotFlagButtonComponent,
        TableSearchButtonComponent,
    ],
    imports: [CommonModule, MiscModule, MaterialModule, PilotFlagsModule, TableViewModule],
    exports: [FloatingButtonsComponent, SidenavOpenButtonComponent],
})
export class FloatingButtonMenuModule {}
