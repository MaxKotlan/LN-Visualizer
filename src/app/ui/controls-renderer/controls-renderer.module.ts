import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RendererSettingsComponent } from './components/renderer-settings/renderer-settings.component';
import { MaterialModule } from '../material';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { reducer } from './reducer';

@NgModule({
    declarations: [RendererSettingsComponent],
    imports: [
        CommonModule,
        FormsModule,
        MaterialModule,
        StoreModule.forFeature('renderControls', reducer),
    ],
    exports: [RendererSettingsComponent],
})
export class ControlsRendererModule {}
