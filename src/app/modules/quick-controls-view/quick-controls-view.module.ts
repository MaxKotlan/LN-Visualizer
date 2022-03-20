import { NgModule } from '@angular/core';
import { ControlsModule } from '../controls/controls.module';
import { MaterialModule } from '../material';
import { QuickControlsViewComponent } from './components';

@NgModule({
    declarations: [QuickControlsViewComponent],
    imports: [MaterialModule, ControlsModule],
    exports: [QuickControlsViewComponent],
})
export class QuickControlsViewModule {}
