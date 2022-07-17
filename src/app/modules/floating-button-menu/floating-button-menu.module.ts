import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiModule } from '../ui/ui.module';
import { MaterialModule } from '../material';
import {
    FilterButtonComponent,
    FloatingButtonsComponent,
    PilotFlagButtonComponent,
    SettingsButtonComponent,
    SidenavOpenButtonComponent,
} from './components';
import { StatsButtonComponent } from './components/stats-button/stats-button.component';
import { PilotFlagsModule } from '../pilot-flags/pilot-flags.module';
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
    imports: [CommonModule, UiModule, MaterialModule, PilotFlagsModule],
    exports: [FloatingButtonsComponent, SidenavOpenButtonComponent],
})
export class FloatingButtonMenuModule {}
