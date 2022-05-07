import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NodeInfoComponent } from './components';
import { MaterialModule } from '../material';
import { TreeDataServiceService } from './services/tree-data-service.service';

@NgModule({
    declarations: [NodeInfoComponent],
    imports: [CommonModule, MaterialModule],
    exports: [NodeInfoComponent],
    providers: [TreeDataServiceService],
})
export class NodeInfoModule {}
