import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableViewComponent } from './components/table-view/table-view.component';
import { MaterialModule } from '../material';
import { FormsModule } from '@angular/forms';
import { NodeTableComponent } from './components/node-table/node-table.component';

@NgModule({
    declarations: [TableViewComponent, NodeTableComponent],
    imports: [CommonModule, FormsModule, MaterialModule],
    exports: [NodeTableComponent],
})
export class TableViewModule {}
