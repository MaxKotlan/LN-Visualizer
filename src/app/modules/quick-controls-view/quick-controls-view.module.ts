import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ControlsModule } from '../controls/controls.module';
import { MaterialModule } from '../material';
import { QuickControlsViewComponent } from './components';
import { QuickSliderComponent } from './components/quick-slider/quick-slider.component';
import { LogToLinearPipe } from './pipes/log-to-linear.pipe';

@NgModule({
    declarations: [QuickControlsViewComponent, QuickSliderComponent, LogToLinearPipe],
    imports: [CommonModule, MaterialModule, FormsModule, ControlsModule],
    exports: [QuickControlsViewComponent],
})
export class QuickControlsViewModule {}
