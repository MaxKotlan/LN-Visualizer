export interface PaymentMethod {
    activated: true;
    destination: string;
    paymentLink: string;
    rate: string;
    paymentMethodPaid: string;
    totalPaid: string;
    due: string;
    amount: string;
    networkFee: string;
    payments: [];
    paymentMethod: string;
    cryptoCode: 'BTC';
}
