import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FloatingButtonMenuModule } from '../floating-button-menu/floating-button-menu.module';
import { GraphRendererModule } from '../graph-renderer';
import { UiModule } from '../ui/ui.module';
import { GraphViewComponent } from './components';
import { DonateModule } from '../donate/donate.module';
import { AlertsModule } from '../alerts/alerts.module';

@NgModule({
    declarations: [GraphViewComponent],
    imports: [
        CommonModule,
        FloatingButtonMenuModule,
        GraphRendererModule,
        UiModule,
        DonateModule,
        AlertsModule,
    ],
    exports: [GraphViewComponent],
})
export class GraphViewModule {}
