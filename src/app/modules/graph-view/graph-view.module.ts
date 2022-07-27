import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FloatingButtonMenuModule } from '../floating-button-menu/floating-button-menu.module';
import { GraphRendererModule } from 'src/app/renderer/graph-renderer';
import { UiModule } from '../ui/ui.module';
import { GraphViewComponent } from './components';
import { DonateModule } from '../donate/donate.module';
import { AlertsModule } from '../alerts/alerts.module';
import { ControlsSearchModule } from '../controls-search/controls-search.module';

@NgModule({
    declarations: [GraphViewComponent],
    imports: [
        CommonModule,
        FloatingButtonMenuModule,
        GraphRendererModule,
        ControlsSearchModule,
        UiModule,
        DonateModule,
        AlertsModule,
    ],
    exports: [GraphViewComponent],
})
export class GraphViewModule {}
