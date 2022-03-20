import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FloatingButtonMenuModule } from '../floating-button-menu/floating-button-menu.module';
import { GraphRendererModule } from '../graph-renderer';
import { UiModule } from '../ui/ui.module';
import { GraphViewComponent } from './components';

@NgModule({
    declarations: [GraphViewComponent],
    imports: [CommonModule, FloatingButtonMenuModule, GraphRendererModule, UiModule],
    exports: [GraphViewComponent],
})
export class GraphViewModule {}
