import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableViewComponent } from './components/table-view/table-view.component';
import { MaterialModule } from '../material';

@NgModule({
    declarations: [TableViewComponent],
    imports: [CommonModule, MaterialModule],
    exports: [TableViewComponent],
})
export class TableViewModule {}
