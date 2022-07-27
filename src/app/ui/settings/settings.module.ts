import { NgModule } from '@angular/core';
import { ControlsModule } from './controls/controls.module';

@NgModule({
    imports: [ControlsModule],
    exports: [ControlsModule],
})
export class SettingsModule {}
