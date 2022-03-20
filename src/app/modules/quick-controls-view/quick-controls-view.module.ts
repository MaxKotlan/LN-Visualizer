import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ControlsModule } from '../controls/controls.module';
import { MaterialModule } from '../material';
import { QuickControlsViewComponent } from './components';
import { QuickSliderComponent } from './components/quick-slider/quick-slider.component';

@NgModule({
    declarations: [QuickControlsViewComponent, QuickSliderComponent],
    imports: [CommonModule, MaterialModule, FormsModule, ControlsModule],
    exports: [QuickControlsViewComponent],
})
export class QuickControlsViewModule {}
