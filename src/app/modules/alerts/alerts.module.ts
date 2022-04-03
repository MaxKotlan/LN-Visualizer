import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertsBannerComponent } from './components/alerts-banner/alerts-banner.component';
import { MaterialModule } from '../material';
import { StoreModule } from '@ngrx/store';
import { reducer } from './reducers';

@NgModule({
    declarations: [AlertsBannerComponent],
    imports: [CommonModule, MaterialModule, StoreModule.forFeature('alerts', reducer)],
    exports: [AlertsBannerComponent],
})
export class AlertsModule {}
