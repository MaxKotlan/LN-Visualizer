import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ControlsModule } from '../controls/controls.module';
import { MaterialModule } from '../material';
import { UnitConversionsModule } from '../unit-conversions/unit-conversions.module';
import { QuickControlsViewComponent } from './components';
import { QuickSliderComponent } from './components/quick-slider/quick-slider.component';
import { LinearToLogPipe, LogToLinearPipe } from './pipes/log-to-linear.pipe';
import { MiniInputComponent } from './components/mini-input/mini-input.component';
import { FilterTemplatesModule } from '../filter-templates/filter-templates.module';

@NgModule({
    declarations: [
        QuickControlsViewComponent,
        QuickSliderComponent,
        LogToLinearPipe,
        LinearToLogPipe,
        MiniInputComponent,
    ],
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        ControlsModule,
        UnitConversionsModule,
        FilterTemplatesModule,
    ],
    exports: [QuickControlsViewComponent],
})
export class QuickControlsViewModule {}
