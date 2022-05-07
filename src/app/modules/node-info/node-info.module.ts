import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NodeInfoComponent } from './components';
import { MaterialModule } from '../material';

@NgModule({
    declarations: [NodeInfoComponent],
    imports: [CommonModule, MaterialModule],
    exports: [NodeInfoComponent],
})
export class NodeInfoModule {}
