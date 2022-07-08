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

@NgModule({
    declarations: [
        SettingsButtonComponent,
        FloatingButtonsComponent,
        FilterButtonComponent,
        SidenavOpenButtonComponent,
        StatsButtonComponent,
        PilotFlagButtonComponent,
    ],
    imports: [CommonModule, UiModule, MaterialModule, PilotFlagsModule],
    exports: [FloatingButtonsComponent, SidenavOpenButtonComponent],
})
export class FloatingButtonMenuModule {}
