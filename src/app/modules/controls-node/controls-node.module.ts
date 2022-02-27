import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material';
import { FormsModule } from '@angular/forms';
import { NodeSettingsComponent } from './components';

@NgModule({
    declarations: [NodeSettingsComponent],
    imports: [CommonModule, MaterialModule, FormsModule],
    exports: [NodeSettingsComponent],
})
export class ControlsNodeModule {}
