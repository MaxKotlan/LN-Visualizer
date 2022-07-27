import { NgModule } from '@angular/core';
import { GraphRendererModule } from 'src/app/renderer/graph-renderer';

@NgModule({
    imports: [GraphRendererModule],
    exports: [GraphRendererModule],
})
export class RendererModule {}
