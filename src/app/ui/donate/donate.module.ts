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
import { DonateLoadingComponent } from './components/donate-loading/donate-loading.component';
import { EnterInvoiceAmountComponent } from './components/enter-invoice-amount/enter-invoice-amount.component';
import { InvoicePendingComponent } from './components/invoice-pending/invoice-pending.component';
import { InvoiceErrorComponent } from './components/invoice-error/invoice-error.component';
import { PaymentCompleteComponent } from './components/payment-complete/payment-complete.component';
import { ControlsMiscModule } from '../settings/controls-misc/controls-misc.module';
import { DonateBtcpayComponent } from './components/donate-btcpay/donate-btcpay.component';

@NgModule({
    declarations: [
        DonateButtonComponent,
        DonateModalComponent,
        SafePipe,
        DonateLoadingComponent,
        EnterInvoiceAmountComponent,
        InvoicePendingComponent,
        InvoiceErrorComponent,
        PaymentCompleteComponent,
        DonateBtcpayComponent,
    ],
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        QRCodeModule,
        EffectsModule.forFeature([DonateEffects]),
        ControlsMiscModule,
        StoreModule.forFeature('donate', reducer),
    ],
    providers: [DonateApiService],
    exports: [DonateButtonComponent],
})
export class DonateModule {}
