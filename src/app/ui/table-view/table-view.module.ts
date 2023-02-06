import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableViewComponent } from './components/table-view/table-view.component';
import { MaterialModule } from '../material';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [TableViewComponent],
    imports: [CommonModule, FormsModule, MaterialModule],
    exports: [TableViewComponent],
})
export class TableViewModule {}
