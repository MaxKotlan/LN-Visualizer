import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiModule } from '../ui/ui.module';
import { MaterialModule } from '../material';
import {
    FilterButtonComponent,
    FloatingButtonsComponent,
    SettingsButtonComponent,
    SidenavOpenButtonComponent,
} from './components';
import { StatsButtonComponent } from './components/stats-button/stats-button.component';

@NgModule({
    declarations: [
        SettingsButtonComponent,
        FloatingButtonsComponent,
        FilterButtonComponent,
        SidenavOpenButtonComponent,
        StatsButtonComponent,
    ],
    imports: [CommonModule, UiModule, MaterialModule],
    exports: [FloatingButtonsComponent, SidenavOpenButtonComponent],
})
export class FloatingButtonMenuModule {}
