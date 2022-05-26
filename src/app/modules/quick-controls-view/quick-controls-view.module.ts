import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ControlsModule } from '../controls/controls.module';
import { MaterialModule } from '../material';
import { UnitConversionsModule } from '../unit-conversions/unit-conversions.module';
import { QuickControlsViewComponent } from './components';
import { QuickSliderComponent } from './components/quick-slider/quick-slider.component';
import { LogToLinearPipe } from './pipes/log-to-linear.pipe';
import { MiniInputComponent } from './components/mini-input/mini-input.component';

@NgModule({
    declarations: [QuickControlsViewComponent, QuickSliderComponent, LogToLinearPipe, MiniInputComponent],
    imports: [CommonModule, MaterialModule, FormsModule, ControlsModule, UnitConversionsModule],
    exports: [QuickControlsViewComponent],
})
export class QuickControlsViewModule {}
