import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GraphRendererModule } from 'src/app/renderer/graph-renderer';
import { AlertsModule } from '../alerts/alerts.module';
import { ControlsSearchModule } from '../controls-search/controls-search.module';
import { DonateModule } from '../donate/donate.module';
import { FloatingButtonMenuModule } from '../floating-button-menu/floating-button-menu.module';
import { MiscModule } from '../misc/misc.module';
import { GraphViewComponent } from './components';

@NgModule({
    declarations: [GraphViewComponent],
    imports: [
        CommonModule,
        FloatingButtonMenuModule,
        GraphRendererModule,
        ControlsSearchModule,
        MiscModule,
        DonateModule,
        AlertsModule,
    ],
    exports: [GraphViewComponent],
})
export class GraphViewModule {}
