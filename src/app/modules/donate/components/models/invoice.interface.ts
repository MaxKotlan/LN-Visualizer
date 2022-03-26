export interface Invoice {
    id: string;
    storeId: string;
    amount: string;
    checkoutLink: string;
    status: string;
    additionalStatus: string;
    monitoringExpiration: number;
    expirationTime: number;
    createdTime: number;
    availableStatusesForManualMarking: ['Settled', 'Invalid'];
    archived: false;
    type: string;
    currency: string;
    metadata: {
        orderId: string;
        orderUrl: string;
    };
    checkout: {
        speedPolicy: string;
        paymentMethods: string[];
        defaultPaymentMethod: string;
        expirationMinutes: number;
        monitoringMinutes: number;
        paymentTolerance: number;
        redirectURL: string | null;
        redirectAutomatically: boolean;
        requiresRefundEmail: string | null;
        defaultLanguage: string | null;
    };
}
