import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchAndGoComponent, SearchComponent } from './components';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../material';

@NgModule({
    declarations: [SearchAndGoComponent, SearchComponent],
    imports: [CommonModule, FormsModule, MaterialModule],
    exports: [SearchAndGoComponent],
})
export class ControlsSearchModule {}
