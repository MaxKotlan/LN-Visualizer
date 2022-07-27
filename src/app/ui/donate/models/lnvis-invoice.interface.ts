import { PaymentMethod } from './payment-methods.inteface';

export interface LnVisInvoice {
    id: string;
    amount: string;
    status: string;
    additionalStatus: string;
    monitoringExpiration: number;
    expirationTime: number;
    createdTime: number;
    archived: false;
    type: string;
    currency: string;
    checkout: {
        speedPolicy: string;
        paymentMethods: PaymentMethod[];
        defaultPaymentMethod: string;
        expirationMinutes: number;
        monitoringMinutes: number;
    };
}
