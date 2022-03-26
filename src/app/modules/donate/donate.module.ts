import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DonateButtonComponent } from './components';
import { MaterialModule } from '../material';
import { DonateModalComponent } from './components/donate-modal/donate-modal.component';
import { DonateApiService } from './services/donate-api.service';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { reducer } from './reducers';
import { EffectsModule } from '@ngrx/effects';
import { DonateEffects } from './effects/donate.effects';
import { QRCodeModule } from 'angularx-qrcode';
import { SafePipe } from './pipe/safe.pipe';

@NgModule({
    declarations: [DonateButtonComponent, DonateModalComponent, SafePipe],
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        QRCodeModule,
        EffectsModule.forFeature([DonateEffects]),
        StoreModule.forFeature('donate', reducer),
    ],
    providers: [DonateApiService],
    exports: [DonateButtonComponent],
})
export class DonateModule {}
